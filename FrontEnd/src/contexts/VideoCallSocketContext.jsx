import { createContext, useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "./AuthContext"
import { CONFIG } from "../configs/config"
import IncomingCallPortal from "../components/user/video-call/IncomingCallPortal"
import VideoCallPortal from "../components/user/video-call/VideoCallPortal"

export const VideoCallSocketContext = createContext()

export const VideoCallProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    let peerConnection = useRef(null)
    let videoCallSocket = useRef(null)
    const [callFrom, setCallFrom] = useState(null)
    const [incoming, setIncoming] = useState(null)
    const recipientRef = useRef(null)
    const [action, setAction] = useState(null)
    const [openingVideoCall, setOpeningVideoCall] = useState(false)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    useEffect(() => {
        if (user.username) {
            connectVideoCallSocket()
        }
        return () => {
            disConnectVideoCallSocket()
        }
    }, [user])

    const connectVideoCallSocket = () => {
        const token = localStorage.getItem("token")
        videoCallSocket.current = new WebSocket(`${CONFIG.BASE_URL}/video-call?token=${token}`);
        videoCallSocket.current.onopen = () => {
            console.log("Kết nối video call socket thành công", user.username)
        }
        videoCallSocket.current.onmessage = (message) => {
            handleSignalData(JSON.parse(message.data))
        }
        videoCallSocket.current.onerror = (error) => {
            console.log("Lỗi kết nối video call socket:", error)
        }
    }

    const disConnectVideoCallSocket = () => {
        if (videoCallSocket.current)
            videoCallSocket.current.close()
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
            console.log(`${recipientRef.current} đã từ chối cuộc gọi`)
        }
        if (data.type === 'candidate') {
            console.log("Nhận được candidate mới")
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        if (data.type === 'offer') {
            if (!peerConnection.current) {
                peerConnection.current = new RTCPeerConnection(configuration);
            }
            await setTrackForConnection()
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            createAnswer();
            console.log("Client 2 hoàn tất tạo kết nối", peerConnection.current.remoteDescription)
        }
        if (data.type === 'answer') {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log("Client 1 hoàn tất tạo kết nối", peerConnection.current.remoteDescription)

        }
    }
    const startCall = (recipientUsername) => {
        recipientRef.current = recipientUsername
        setAction("request-call")
        setOpeningVideoCall(true)
        console.log(`Đã gửi yêu cầu gọi tới ${recipientRef.current}`);
    }

    const handleAcceptCall = (callFrom) => {
        recipientRef.current = callFrom
        setIncoming(false);
        setAction("accept")
        setOpeningVideoCall(true)
        console.log("Cuộc gọi được chấp nhận!");
    }

    const handleRejectCall = () => {
        setIncoming(false);
        sendSignal({ type: "reject", recipient: recipientRef.current })
        console.log("Đã từ chối cuộc gọi!");
    }

    const startVideoStream = async () => {
        console.log("Đang bật video")
        let stream = await navigator.mediaDevices.getUserMedia({ video: true })
        localVideoRef.current.srcObject = stream
    }
    const setTrackForConnection = async () => {
        let stream = localVideoRef.current.srcObject
        stream.getTracks().forEach(track => {
            const sender = peerConnection.current.getSenders().find(s => s.track === track);
            if (!sender) {
                peerConnection.current.addTrack(track, stream);
            }
        });
        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0]
        }
    }

    const sendSignal = (data) => {
        videoCallSocket.current.send(JSON.stringify(data))
    }

    const connectWebRTC = async () => {
        peerConnection.current = new RTCPeerConnection(configuration)
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal({
                    type: 'candidate',
                    candidate: event.candidate,
                    recipient: recipientRef.current
                });
            }
        };
        await setTrackForConnection()
        createOffer()
    }

    const createOffer = async () => {
        const offer = await peerConnection.current.createOffer()
        await peerConnection.current.setLocalDescription(offer)
        const data = {
            type: 'offer',
            offer,
            recipient: recipientRef.current
        }
        sendSignal(data)
    }

    const createAnswer = async () => {
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        const data = {
            type: 'answer',
            answer,
            recipient: recipientRef.current
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

    const PROVIDER_VALUE = { startCall }

    return (
        <VideoCallSocketContext.Provider value={PROVIDER_VALUE}>
            {children}
            <IncomingCallPortal
                incoming={incoming}
                callFrom={callFrom}
                handleAcceptCall={handleAcceptCall}
                handleRejectCall={handleRejectCall} />

            <VideoCallPortal
                show={openingVideoCall} handleCloseVideoCall={handleCloseVideoCall}
                localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef}
                startVideoStream={startVideoStream}
                sendSignal={sendSignal} action={action} recipientRef={recipientRef} />
        </VideoCallSocketContext.Provider>
    )
}