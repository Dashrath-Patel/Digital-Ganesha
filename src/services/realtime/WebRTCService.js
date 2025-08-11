/**
 * WebRTC service for video calling and virtual darshan
 * Handles peer-to-peer connections, media streaming, and call management
 */

class WebRTCServiceClass {
  constructor() {
    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null
    this.isCallActive = false
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for production
        // { 
        //   urls: 'turn:your-turn-server.com:3478',
        //   username: 'username',
        //   credential: 'password'
        // }
      ]
    }
    this.mediaConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }
    this.eventListeners = new Map()
  }

  // Initialize WebRTC connection
  async initializeConnection() {
    try {
      this.peerConnection = new RTCPeerConnection(this.configuration)
      this.setupPeerConnectionHandlers()
      return this.peerConnection
    } catch (error) {
      console.error('Failed to initialize WebRTC connection:', error)
      throw error
    }
  }

  // Setup peer connection event handlers
  setupPeerConnectionHandlers() {
    if (!this.peerConnection) return

    // ICE candidate handler
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('ice-candidate', event.candidate)
      }
    }

    // Remote stream handler
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream')
      this.remoteStream = event.streams[0]
      this.emit('remote-stream', this.remoteStream)
    }

    // Connection state handlers
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState)
      this.emit('connection-state-change', this.peerConnection.connectionState)
      
      if (this.peerConnection.connectionState === 'connected') {
        this.isCallActive = true
        this.emit('call-connected')
      } else if (this.peerConnection.connectionState === 'disconnected') {
        this.isCallActive = false
        this.emit('call-disconnected')
      }
    }

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState)
      this.emit('ice-connection-state-change', this.peerConnection.iceConnectionState)
    }

    // Data channel handler
    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel
      this.setupDataChannel(channel)
    }
  }

  // Get user media (camera and microphone)
  async getUserMedia(constraints = this.mediaConstraints) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.emit('local-stream', this.localStream)
      return this.localStream
    } catch (error) {
      console.error('Failed to get user media:', error)
      this.emit('media-error', error)
      throw error
    }
  }

  // Get screen share
  async getDisplayMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getDisplayMedia(constraints)
      this.emit('screen-share', this.localStream)
      return this.localStream
    } catch (error) {
      console.error('Failed to get display media:', error)
      this.emit('screen-share-error', error)
      throw error
    }
  }

  // Add local stream to peer connection
  addLocalStream() {
    if (!this.localStream || !this.peerConnection) {
      throw new Error('Local stream or peer connection not available')
    }

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream)
    })
  }

  // Create offer for outgoing call
  async createOffer() {
    try {
      if (!this.peerConnection) {
        await this.initializeConnection()
      }

      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      
      this.emit('offer-created', offer)
      return offer
    } catch (error) {
      console.error('Failed to create offer:', error)
      throw error
    }
  }

  // Create answer for incoming call
  async createAnswer(offer) {
    try {
      if (!this.peerConnection) {
        await this.initializeConnection()
      }

      await this.peerConnection.setRemoteDescription(offer)
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      
      this.emit('answer-created', answer)
      return answer
    } catch (error) {
      console.error('Failed to create answer:', error)
      throw error
    }
  }

  // Handle incoming answer
  async handleAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(answer)
      this.emit('answer-handled')
    } catch (error) {
      console.error('Failed to handle answer:', error)
      throw error
    }
  }

  // Add ICE candidate
  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error('Failed to add ICE candidate:', error)
      throw error
    }
  }

  // Start call
  async startCall(isVideo = true, isAudio = true) {
    try {
      // Get user media
      const constraints = {
        video: isVideo ? this.mediaConstraints.video : false,
        audio: isAudio ? this.mediaConstraints.audio : false
      }
      
      await this.getUserMedia(constraints)
      
      // Initialize peer connection
      await this.initializeConnection()
      
      // Add local stream
      this.addLocalStream()
      
      // Create offer
      const offer = await this.createOffer()
      
      this.emit('call-started', { offer, hasVideo: isVideo, hasAudio: isAudio })
      return offer
    } catch (error) {
      console.error('Failed to start call:', error)
      this.emit('call-error', error)
      throw error
    }
  }

  // Answer call
  async answerCall(offer, isVideo = true, isAudio = true) {
    try {
      // Get user media
      const constraints = {
        video: isVideo ? this.mediaConstraints.video : false,
        audio: isAudio ? this.mediaConstraints.audio : false
      }
      
      await this.getUserMedia(constraints)
      
      // Initialize peer connection
      await this.initializeConnection()
      
      // Add local stream
      this.addLocalStream()
      
      // Create answer
      const answer = await this.createAnswer(offer)
      
      this.emit('call-answered', { answer, hasVideo: isVideo, hasAudio: isAudio })
      return answer
    } catch (error) {
      console.error('Failed to answer call:', error)
      this.emit('call-error', error)
      throw error
    }
  }

  // End call
  endCall() {
    try {
      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop())
        this.localStream = null
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection = null
      }

      this.isCallActive = false
      this.remoteStream = null
      
      this.emit('call-ended')
    } catch (error) {
      console.error('Error ending call:', error)
      throw error
    }
  }

  // Toggle video
  toggleVideo() {
    if (!this.localStream) return false

    const videoTrack = this.localStream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      this.emit('video-toggled', videoTrack.enabled)
      return videoTrack.enabled
    }
    
    return false
  }

  // Toggle audio
  toggleAudio() {
    if (!this.localStream) return false

    const audioTrack = this.localStream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      this.emit('audio-toggled', audioTrack.enabled)
      return audioTrack.enabled
    }
    
    return false
  }

  // Switch camera (front/back on mobile)
  async switchCamera() {
    try {
      if (!this.localStream) return

      const videoTrack = this.localStream.getVideoTracks()[0]
      if (!videoTrack) return

      // Get current facing mode
      const settings = videoTrack.getSettings()
      const currentFacingMode = settings.facingMode || 'user'
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'

      // Stop current track
      videoTrack.stop()

      // Get new stream with different camera
      const newConstraints = {
        ...this.mediaConstraints,
        video: {
          ...this.mediaConstraints.video,
          facingMode: newFacingMode
        }
      }

      const newStream = await navigator.mediaDevices.getUserMedia(newConstraints)
      const newVideoTrack = newStream.getVideoTracks()[0]

      // Replace track in peer connection
      if (this.peerConnection) {
        const sender = this.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )
        
        if (sender) {
          await sender.replaceTrack(newVideoTrack)
        }
      }

      // Update local stream
      this.localStream.removeTrack(videoTrack)
      this.localStream.addTrack(newVideoTrack)

      this.emit('camera-switched', newFacingMode)
    } catch (error) {
      console.error('Failed to switch camera:', error)
      throw error
    }
  }

  // Create data channel for text chat during video call
  createDataChannel(label = 'chat') {
    if (!this.peerConnection) return null

    const channel = this.peerConnection.createDataChannel(label)
    this.setupDataChannel(channel)
    return channel
  }

  // Setup data channel handlers
  setupDataChannel(channel) {
    channel.onopen = () => {
      console.log('Data channel opened:', channel.label)
      this.emit('data-channel-open', channel)
    }

    channel.onmessage = (event) => {
      console.log('Data channel message:', event.data)
      this.emit('data-channel-message', event.data)
    }

    channel.onclose = () => {
      console.log('Data channel closed:', channel.label)
      this.emit('data-channel-close', channel)
    }

    channel.onerror = (error) => {
      console.error('Data channel error:', error)
      this.emit('data-channel-error', error)
    }
  }

  // Get call statistics
  async getStats() {
    if (!this.peerConnection) return null

    try {
      const stats = await this.peerConnection.getStats()
      const result = {}

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' || report.type === 'outbound-rtp') {
          result[report.type] = result[report.type] || []
          result[report.type].push(report)
        }
      })

      return result
    } catch (error) {
      console.error('Failed to get stats:', error)
      return null
    }
  }

  // Add event listener
  on(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    
    this.eventListeners.get(eventType).push(callback)
    
    // Return unsubscribe function
    return () => this.off(eventType, callback)
  }

  // Remove event listener
  off(eventType, callback) {
    if (!this.eventListeners.has(eventType)) return
    
    const listeners = this.eventListeners.get(eventType)
    const index = listeners.indexOf(callback)
    
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  // Emit event to listeners
  emit(eventType, ...args) {
    if (!this.eventListeners.has(eventType)) return
    
    const listeners = this.eventListeners.get(eventType)
    listeners.forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        console.error('Error in WebRTC event listener:', error)
      }
    })
  }

  // Check WebRTC support
  static isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection
    )
  }

  // Get available devices
  async getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return {
        videoInputs: devices.filter(device => device.kind === 'videoinput'),
        audioInputs: devices.filter(device => device.kind === 'audioinput'),
        audioOutputs: devices.filter(device => device.kind === 'audiooutput')
      }
    } catch (error) {
      console.error('Failed to get devices:', error)
      return { videoInputs: [], audioInputs: [], audioOutputs: [] }
    }
  }

  // Cleanup
  destroy() {
    this.endCall()
    this.eventListeners.clear()
  }
}

// Export singleton instance
export const WebRTCService = new WebRTCServiceClass()
export default WebRTCService
