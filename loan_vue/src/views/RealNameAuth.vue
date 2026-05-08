<template>
  <div class="real-name-auth">
    <div class="auth-header">
      <button class="back-button" @click="goBack">←</button>
      <h2 class="auth-title">实名认证</h2>
    </div>

    <div class="auth-content">
      <!-- 步骤指示器 -->
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-text">上传身份证</div>
        </div>
        <div class="step-line"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-text">人脸识别</div>
        </div>
        <div class="step-line"></div>
        <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-text">认证完成</div>
        </div>
      </div>

      <!-- 第一步：上传身份证 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="upload-section">
          <h3 class="upload-title">请上传您的身份证照片</h3>
          <p class="upload-desc">请确保身份证信息清晰可见，无反光无遮挡</p>
          
          <div class="upload-cards">
            <div class="upload-card" @click="triggerFileInput('front')">
              <div v-if="!idCardFront" class="upload-placeholder">
                <div class="upload-icon">📷</div>
                <div class="upload-text">点击上传人像面</div>
              </div>
              <div v-else class="upload-preview">
                <img :src="idCardFront" alt="身份证人像面" />
                <div class="upload-overlay">
                  <button class="reupload-btn" @click.stop="triggerFileInput('front')">重新上传</button>
                </div>
              </div>
              <input
                ref="frontInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload($event, 'front')"
                style="display: none"
              />
            </div>

            <div class="upload-card" @click="triggerFileInput('back')">
              <div v-if="!idCardBack" class="upload-placeholder">
                <div class="upload-icon">📷</div>
                <div class="upload-text">点击上传国徽面</div>
              </div>
              <div v-else class="upload-preview">
                <img :src="idCardBack" alt="身份证国徽面" />
                <div class="upload-overlay">
                  <button class="reupload-btn" @click.stop="triggerFileInput('back')">重新上传</button>
                </div>
              </div>
              <input
                ref="backInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload($event, 'back')"
                style="display: none"
              />
            </div>
          </div>
        </div>

        <button 
          class="next-button" 
          :disabled="!idCardFront || !idCardBack"
          @click="nextStep"
        >
          下一步
        </button>
      </div>

      <!-- 第二步：人脸识别 -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="face-section">
          <h3 class="face-title">进行人脸识别</h3>
          <p class="face-desc">请确保光线充足，面部无遮挡</p>
          
          <div class="face-camera">
            <div v-if="!cameraStream && !facePhoto" class="camera-placeholder" @click="startCamera">
              <div class="camera-icon">📷</div>
              <div class="camera-text">点击开启摄像头</div>
            </div>
            <div v-else-if="cameraStream && !facePhoto" class="camera-active">
              <video ref="videoElement" autoplay playsinline class="camera-video"></video>
              <div class="camera-overlay">
                <div class="face-guide"></div>
              </div>
            </div>
            <div v-else-if="facePhoto" class="face-preview">
              <img :src="facePhoto" alt="人脸照片" />
              <div class="face-overlay">
                <button class="retake-btn" @click="retakePhoto">重新拍照</button>
              </div>
            </div>
          </div>

          <button 
            v-if="cameraStream && !facePhoto"
            class="camera-button" 
            @click="takePhoto"
          >
            📷 拍照
          </button>
          
          <button 
            v-if="!cameraStream && !facePhoto"
            class="camera-button" 
            @click="startCamera"
          >
            📷 开启摄像头
          </button>

          <button 
            v-if="facePhoto"
            class="confirm-button" 
            @click="confirmPhoto"
          >
            确认上传
          </button>
        </div>
      </div>

      <!-- 第三步：认证完成 -->
      <div v-if="currentStep === 3" class="step-content">
        <div class="success-section">
          <div class="success-icon">✅</div>
          <h3 class="success-title">实名认证成功</h3>
          <p class="success-desc">恭喜您已完成实名认证，现在可以享受更多服务</p>
          <button class="finish-button" @click="finishAuth">完成</button>
        </div>
      </div>
    </div>

    <!-- 认证中弹窗 -->
    <div v-if="showProcessingModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="processing-icon">⏳</div>
        <h3 class="processing-title">认证中</h3>
        <p class="processing-text">请稍候，正在处理您的认证请求...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RealNameAuth',
  data() {
    return {
      currentStep: 1,
      idCardFront: '',
      idCardBack: '',
      facePhoto: '',
      showProcessingModal: false,
      cameraStream: null
    }
  },
  methods: {
    goBack() {
      if (this.currentStep > 1) {
        this.currentStep--
      } else {
        this.$router.push('/')
      }
    },

    triggerFileInput(type) {
      if (type === 'front') {
        this.$refs.frontInput.click()
      } else {
        this.$refs.backInput.click()
      }
    },

    handleFileUpload(event, type) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (type === 'front') {
            this.idCardFront = e.target.result
          } else {
            this.idCardBack = e.target.result
          }
        }
        reader.readAsDataURL(file)
      }
    },

    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },

    async startCamera() {
      try {
        // 请求摄像头权限
        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        })
        
        // 将视频流绑定到video元素
        this.$nextTick(() => {
          if (this.$refs.videoElement) {
            this.$refs.videoElement.srcObject = this.cameraStream
          }
        })
      } catch (error) {
        console.error('摄像头启动失败:', error)
        alert('无法访问摄像头，请检查权限设置')
      }
    },

    takePhoto() {
      if (!this.cameraStream) {
        alert('摄像头未启动')
        return
      }
      
      const video = this.$refs.videoElement
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      // 设置canvas尺寸
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // 绘制当前视频帧
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // 转换为base64图片
      this.facePhoto = canvas.toDataURL('image/jpeg', 0.8)
      
      // 停止摄像头
      this.stopCamera()
    },

    stopCamera() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop())
        this.cameraStream = null
      }
    },

    retakePhoto() {
      this.facePhoto = ''
      // 重新开始摄像头
      this.$nextTick(() => {
        this.startCamera()
      })
    },

    confirmPhoto() {
      this.showProcessingModal = true
      // 模拟认证过程
      setTimeout(() => {
        this.showProcessingModal = false
        this.currentStep = 3
        // 设置认证成功标志
        localStorage.setItem('faced', 'true')
        // 预留接口：调用后端API进行人脸识别验证
        this.processFaceRecognition()
      }, 3000)
    },

    processFaceRecognition() {
      // 预留接口：人脸识别验证
      console.log('调用API进行人脸识别验证')
      // const response = await this.$api.verifyFace({
      //   idCardFront: this.idCardFront,
      //   idCardBack: this.idCardBack,
      //   facePhoto: this.facePhoto
      // })
      // if (response.success) {
      //   localStorage.setItem('faced', 'true')
      //   this.currentStep = 3
      // } else {
      //   alert('人脸识别失败，请重新尝试')
      //   this.facePhoto = ''
      // }
    },

    closeModal() {
      this.showProcessingModal = false
    },

    finishAuth() {
      this.$router.push('/')
    }
  },
  
  beforeDestroy() {
    // 组件销毁时清理摄像头资源
    this.stopCamera()
  }
}
</script>

<style scoped>
.real-name-auth {
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.18), transparent 30%),
    radial-gradient(circle at 86% 8%, rgba(255, 148, 94, 0.18), transparent 28%),
    linear-gradient(180deg, #eef8f6 0%, #f8f3ec 42%, #f5f7fb 100%);
  padding: 16px 14px 32px;
  color: #18212c;
}

.auth-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.back-button {
  background: #fff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  color: #17736c;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(32, 55, 76, 0.08);
}

.auth-title {
  font-size: 20px;
  font-weight: 900;
  color: #1b2734;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.08);
  backdrop-filter: blur(18px);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eef2f6;
  color: #8a96a3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
}

.step.completed .step-number {
  background: #17736c;
  color: white;
}

.step-text {
  font-size: 12px;
  color: #8a96a3;
  font-weight: 800;
  text-align: center;
}

.step.active .step-text {
  color: #17736c;
}

.step.completed .step-text {
  color: #17736c;
}

.step-line {
  height: 2px;
  background: #e8edf2;
  flex: 1;
  margin: 0 8px;
  position: relative;
  top: -16px;
}

.step-line.completed {
  background: #4caf50;
}

.step-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  backdrop-filter: blur(18px);
}

.upload-section, .face-section {
  text-align: center;
}

.upload-title, .face-title {
  font-size: 18px;
  font-weight: 900;
  color: #1b2734;
  margin-bottom: 8px;
}

.upload-desc, .face-desc {
  font-size: 14px;
  color: #687584;
  margin-bottom: 24px;
}

.upload-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.upload-card {
  flex: 1;
  height: 160px;
  border: 2px dashed #bfd7d2;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-card:hover {
  border-color: #2cb59c;
  background: #f0faf5;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
  color: #8a96a3;
}

.upload-text {
  font-size: 14px;
  color: #687584;
}

.upload-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-preview:hover .upload-overlay {
  opacity: 1;
}

.reupload-btn {
  background: white;
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.face-camera {
  width: 280px;
  height: 280px;
  border: 3px dashed #bfd7d2;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #f8fafb;
}

.camera-placeholder {
  text-align: center;
}

.camera-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #999;
}

.camera-text {
  font-size: 14px;
  color: #666;
}

.face-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.face-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.face-preview:hover .face-overlay {
  opacity: 1;
}

.retake-btn {
  background: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.next-button, .camera-button, .confirm-button, .finish-button {
  background: linear-gradient(135deg, #142744, #17736c 58%, #ff8857);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  box-shadow: 0 12px 24px rgba(23, 115, 108, 0.18);
}

.next-button:hover, .camera-button:hover, .confirm-button:hover, .finish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(23, 115, 108, 0.22);
}

.next-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.next-button:disabled:hover {
  transform: none;
}

.success-section {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  color: #1b2734;
  font-weight: 900;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 16px;
  color: #687584;
  margin-bottom: 32px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 29, 43, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  max-width: 300px;
  width: 90%;
}

.processing-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

.processing-title {
  font-size: 20px;
  font-weight: 600;
  color: #1b2734;
  font-weight: 900;
  margin-bottom: 8px;
}

.processing-text {
  font-size: 14px;
  color: #687584;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .upload-cards {
    flex-direction: column;
  }
  
  .upload-card {
    height: 120px;
  }
  
  .face-camera {
    width: 160px;
    height: 160px;
  }
}
</style>
