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
            <div v-if="!facePhoto" class="camera-placeholder">
              <div class="camera-icon">📷</div>
              <div class="camera-text">点击下方按钮开始拍照</div>
            </div>
            <div v-else class="face-preview">
              <img :src="facePhoto" alt="人脸照片" />
              <div class="face-overlay">
                <button class="retake-btn" @click="retakePhoto">重新拍照</button>
              </div>
            </div>
          </div>

          <button 
            v-if="!facePhoto"
            class="camera-button" 
            @click="takePhoto"
          >
            📷 拍照
          </button>

          <button 
            v-else
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
      showProcessingModal: false
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

    takePhoto() {
      // 模拟拍照功能
      // 在实际应用中，这里应该调用摄像头API
      this.facePhoto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+人脸照片</L3RleHQ+PC9zdmc+'
    },

    retakePhoto() {
      this.facePhoto = ''
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
  }
}
</script>

<style scoped>
.real-name-auth {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.auth-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  color: #666;
}

.auth-title {
  font-size: 20px;
  font-weight: 600;
  color: #212121;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding: 0 20px;
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
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #1e88e5;
  color: white;
}

.step.completed .step-number {
  background: #4caf50;
  color: white;
}

.step-text {
  font-size: 12px;
  color: #999;
  text-align: center;
}

.step.active .step-text {
  color: #1e88e5;
}

.step.completed .step-text {
  color: #4caf50;
}

.step-line {
  height: 2px;
  background: #e0e0e0;
  flex: 1;
  margin: 0 8px;
  position: relative;
  top: -16px;
}

.step-line.completed {
  background: #4caf50;
}

.step-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.upload-section, .face-section {
  text-align: center;
}

.upload-title, .face-title {
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 8px;
}

.upload-desc, .face-desc {
  font-size: 14px;
  color: #666;
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
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-card:hover {
  border-color: #1e88e5;
  background: #f8f9ff;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
  color: #999;
}

.upload-text {
  font-size: 14px;
  color: #666;
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
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.face-camera {
  width: 200px;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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
  background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
}

.next-button:hover, .camera-button:hover, .confirm-button:hover, .finish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
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
  color: #212121;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
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
  color: #212121;
  margin-bottom: 8px;
}

.processing-text {
  font-size: 14px;
  color: #666;
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