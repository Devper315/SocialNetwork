import { createContext, useContext, useEffect, useRef, useState, React } from "react"
import { AuthContext } from "./AuthContext"
import { CONFIG } from "../configs/config"
import IncomingCallPortal from "../components/video-call/IncomingCallPortal"
import VideoCallPortal from "../components/video-call/VideoCallPortal"


export const VideoCallSocketContext = createContext()

export const VideoCallProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    let peerConnection = useRef(null)
    let videoCallSocket = useRef(null)
    const [incoming, setIncoming] = useState(false)
    const [openInComing, setOpenIncoming] = useState(false)
    const recipientRef = useRef(null)
    const [action, setAction] = useState(null)
    const [openingVideoCall, setOpeningVideoCall] = useState(false)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const [callType, setCallType] = useState('')
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [remoteCameraOn, setRemoteCameraOn] = useState(false)
    const [remoteMicOn, setRemoteMicOn] = useState(false)
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    useEffect(() => {
        if (user) {
            connectVideoCallSocket()
        }
        return () => {
            disConnectVideoCallSocket()
        }
    }, [user])

    const connectVideoCallSocket = () => {
        const token = localStorage.getItem("token")
        videoCallSocket.current = new WebSocket(`${CONFIG.BASE_URL}/video-call?token=${token}`);
        videoCallSocket.current.onmessage = (message) => {
            handleSignalData(JSON.parse(message.data))
        }
        videoCallSocket.current.onclose = (event) => {
            console.log("Video call socket bị mất kết nối", event)
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
            setIncoming({
                ...data.incoming,
                callFrom: data.sender
            })
            setOpenIncoming(true)
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
        if (data.type === 'remote-device') {
            setRemoteCameraOn(data.isCameraOn)
            setRemoteMicOn(data.isMicOn)
        }
    }

    const startAudioCall = (recipientUsername) => {
        setCallType('audio')
        setIsMicOn(true)
        setRemoteMicOn(true)
        startCall(recipientUsername)
    }

    const startVideoCall = (recipientUsername) => {
        setCallType('video')
        setIsCameraOn(true)
        setIsMicOn(true)
        setRemoteMicOn(true)
        setRemoteCameraOn(true)
        startCall(recipientUsername)
    }

    const startCall = (recipientUsername) => {
        recipientRef.current = recipientUsername
        setAction("request-call")
        setOpeningVideoCall(true)
        console.log(`Đã gửi yêu cầu gọi tới ${recipientRef.current}`);
    }

    const handleAcceptCall = () => {
        recipientRef.current = incoming.callFrom
        setOpenIncoming(false);
        const callType = incoming.type
        if (callType === 'audio') {
            setIsMicOn(true)
            setRemoteMicOn(true)
        }
        else {
            setIsMicOn(true)
            setRemoteMicOn(true)
            setIsCameraOn(true)
            setRemoteCameraOn(true)
        }
        setAction("accept")
        setOpeningVideoCall(true)
        console.log("Cuộc gọi được chấp nhận!");
    }

    const handleRejectCall = () => {
        setOpenIncoming(false);
        sendSignal({ type: "reject", recipient: incoming.callFrom })
        console.log("Đã từ chối cuộc gọi!");
    }

    const startVideoStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: isMicOn })
        localVideoRef.current.srcObject = stream
    }

    const setTrackForConnection = async () => {
        let stream = localVideoRef.current.srcObject
        stream.getTracks().forEach(track => {
            const sender = peerConnection.current.getSenders().find(s => s.track === track);
            if (!sender) {
                peerConnection.current.addTrack(track, stream);
            } else {
                sender.replaceTrack(track);

            }
        });
        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };
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

    const openCamera = async () => {
        console.log("Đang mở camera")
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
            localVideoRef.current.srcObject = stream;
            const videoTrack = stream.getVideoTracks()[0];
            let sender = peerConnection.current.getSenders().find(s => s.track && s.track.kind === videoTrack.kind);
            if (sender) {
                sender.replaceTrack(videoTrack);
            } else {
                peerConnection.current.addTrack(videoTrack, stream);
                createOffer()
            }
            setIsCameraOn(true)
            sendDeviceStatus(true, isMicOn)
        } catch (error) {
            console.error("Không thể mở camera:", error);
        }
    }

    const closeCamera = () => {
        console.log("Đang tắt camera")
        if (localVideoRef.current.srcObject) {
            let stream = localVideoRef.current.srcObject;
            stream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.stop();
                }
            });
            setIsCameraOn(false)
            sendDeviceStatus(false, isMicOn)
        }

    }

    const openMic = async () => {
        console.log("Đang mở mic")
        try {
            let stream = localVideoRef.current.srcObject;
            stream.getAudioTracks()[0].enabled = true
            setIsMicOn(true)
            sendDeviceStatus(isCameraOn, true)
        } catch (error) {
            console.error("Không thể mở mic:", error);
        }
    }

    const closeMic = () => {
        console.log("Đang tắt mic")
        if (localVideoRef.current.srcObject) {
            let stream = localVideoRef.current.srcObject;
            stream.getAudioTracks()[0].enabled = false
            setIsMicOn(false)
            sendDeviceStatus(isCameraOn, false)
        }
    }

    const toggleCamera = () => {
        if (isCameraOn) {
            closeCamera()
        } else {
            openCamera()
        }
        setIsCameraOn(!isCameraOn);
    };

    const toggleMic = () => {
        if (isMicOn) {
            closeMic()
        } else {
            openMic()
        }
        setIsMicOn(!isMicOn);
    };

    const sendDeviceStatus = (cameraOn, micOn) => {
        const data = {
            type: "remote-device",
            isCameraOn: cameraOn,
            isMicOn: micOn,
            recipient: recipientRef.current
        }
        sendSignal(data)
    }

    const PROVIDER_VALUE = { startVideoCall, startAudioCall }

    return (
        <VideoCallSocketContext.Provider value={PROVIDER_VALUE}>
            {children}
            <IncomingCallPortal incoming={incoming} openInComing={openInComing}
                handleAcceptCall={handleAcceptCall}
                handleRejectCall={handleRejectCall} />

            <VideoCallPortal
                show={openingVideoCall} handleCloseVideoCall={handleCloseVideoCall}
                localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef}
                startVideoStream={startVideoStream} callType={callType}
                isCameraOn={isCameraOn} toggleCamera={toggleCamera}
                isMicOn={isMicOn} toggleMic={toggleMic}
                remoteCameraOn={remoteCameraOn} remoteMicOn={remoteMicOn}
                sendSignal={sendSignal} action={action} recipientRef={recipientRef} />
        </VideoCallSocketContext.Provider>
    )
}