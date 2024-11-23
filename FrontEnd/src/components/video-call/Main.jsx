import React, { useRef, useState } from "react";
import VideoCallModal from "./VideoCallModal";
import IncomingCallModal from "./IncomingModal";

const Main = () => {
    const socketRef = useRef(null)
    const [user, setUser] = useState("user1")
    const [recipient, setRecipient] = useState("user2")
    const [action, setAction] = useState(null)
    const [incoming, setIncoming] = useState(false)
    const [callFrom, setCallFrom] = useState(null)
    const [openingVideoCall, setOpeningVideoCall] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const peerConnectionRef = useRef(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

    const connectWebsocket = () => {
        socketRef.current = new WebSocket(`https://f2cc-1-54-7-90.ngrok-free.app/video-call?token=${user}`);
        socketRef.current.onopen = () => {
            setIsLoggedIn(true)
            console.log("Kết nối ws thành công", user)
        }
        socketRef.current.onmessage = (message) => {
            handleSignalData(JSON.parse(message.data))
        }
        socketRef.current.onerror = (error) => {
            console.log("Lỗi kết nối ws:", error)
        }
    }

    const handleSignalData = async (data) => {
        if (data.type === 'request-call') {
            setCallFrom(data.sender)
            setIncoming(true)
        }
        if (data.type === 'accept') {
            console.log("Cuộc gọi được chấp nhận")
            connectWebRTC()
        }
        if (data.type === 'reject') {
            handleCloseVideoCall()
            console.log(`${recipient} đã từ chối cuộc gọi`)
        }
        if (data.type === 'candidate') {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        if (data.type === 'offer') {
            if (!peerConnectionRef.current) {
                peerConnectionRef.current = new RTCPeerConnection(configuration);
            }
            await setTrackForConnection()
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            createAnswer();
            console.log("Client 2 hoàn tất tạo kết nối", peerConnectionRef.current.remoteDescription)
        }
        if (data.type === 'answer') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log("Client 1 hoàn tất tạo kết nối", peerConnectionRef.current.remoteDescription)

        }
    }
    const startCall = () => {
        setAction("request-call")
        setOpeningVideoCall(true)
        console.log(`Đã gửi yêu cầu gọi tới ${recipient}`);
    }

    const handleAcceptCall = () => {
        setIncoming(false);
        setAction("accept")
        setOpeningVideoCall(true)
        console.log("Cuộc gọi được chấp nhận!");
    }

    const handleRejectCall = () => {
        setIncoming(false);
        sendSignal({ type: "reject", recipient })
        console.log("Đã từ chối cuộc gọi!");
    }

    const startVideoStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true })
        localVideoRef.current.srcObject = stream
    }
    const setTrackForConnection = async () => {
        let stream = localVideoRef.current.srcObject
        stream.getTracks().forEach(track => {
            const sender = peerConnectionRef.current.getSenders().find(s => s.track === track);
            if (!sender) {
                peerConnectionRef.current.addTrack(track, stream);
            }
        });
        peerConnectionRef.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0]
        }
    }

    const sendSignal = (data) => {
        socketRef.current.send(JSON.stringify(data))
    }

    const connectWebRTC = async () => {
        peerConnectionRef.current = new RTCPeerConnection(configuration)
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal({
                    type: 'candidate',
                    candidate: event.candidate,
                    recipient
                });
            }
        };
        await setTrackForConnection()
        createOffer()
    }

    const createOffer = async () => {
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)
        const data = {
            type: 'offer',
            offer,
            recipient
        }
        sendSignal(data)
    }

    const createAnswer = async () => {
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        const data = {
            type: 'answer',
            answer,
            recipient
        }
        sendSignal(data);
    };


    const handleCloseVideoCall = () => {
        console.log("Đang đóng video")
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            let stream = localVideoRef.current.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
            remoteVideoRef.current.srcObject = null
        }
        setOpeningVideoCall(false)
    }

    return (
        <div>
            <input placeholder="Tên đăng nhập" value={user}
                onChange={(e) => setUser(e.target.value)} />
            {isLoggedIn && <span>{user} đã đăng nhập</span>}
            <br />
            <input placeholder="Tên người nhận cuộc gọi" value={recipient}
                onChange={(e) => setRecipient(e.target.value)} />
            <br />
            <button onClick={connectWebsocket}>Đăng nhập</button>
            <br />
            <button onClick={startCall}>Bắt đầu cuộc gọi</button>
            <IncomingCallModal
                incoming={incoming}
                callFrom={callFrom}
                handleAcceptCall={handleAcceptCall}
                handleRejectCall={handleRejectCall} />

            <VideoCallModal
                show={openingVideoCall} handleCloseVideoCall={handleCloseVideoCall}
                localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef}
                startVideoStream={startVideoStream}
                sendSignal={sendSignal} action={action} recipient={recipient} />
        </div>
    )
}

export default Main;
