<template>
  <div class="personal-info">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <span class="back-arrow">‹</span>
        <span class="back-text">返回</span>
      </button>
      <h1 class="page-title">个人资料</h1>
      <p class="page-subtitle">{{ isCompleted ? '您的个人信息已完善' : '完善您的个人信息，以便我们更好地为您服务' }}</p>
    </div>

    <form class="info-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label class="form-label">年龄</label>
        <input
          v-model.number="form.age"
          type="number"
          class="form-input"
          placeholder="请输入您的年龄"
          min="18"
          max="65"
          :disabled="!editing"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label">您当前的居住情况是？</label>
        <div class="select-wrapper">
          <select v-model.number="form.housing" class="form-select" :disabled="!editing" required>
            <option value="" disabled>请选择</option>
            <option :value="1">与家人同住/免费居住</option>
            <option :value="2">租房</option>
            <option :value="3">自有住房</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">您当前工作已持续多久？</label>
        <div class="select-wrapper">
          <select v-model.number="form.employmentDuration" class="form-select" :disabled="!editing" required>
            <option value="" disabled>请选择</option>
            <option :value="1">待业/无固定工作</option>
            <option :value="2">未满1年</option>
            <option :value="3">1到3年</option>
            <option :value="4">4到6年</option>
            <option :value="5">7年以上</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">您目前的职业情况最接近以下哪一项？</label>
        <div class="select-wrapper">
          <select v-model.number="form.job" class="form-select" :disabled="!editing" required>
            <option value="" disabled>请选择</option>
            <option :value="1">待业/无固定职业</option>
            <option :value="2">非熟练劳动/基础岗位</option>
            <option :value="3">熟练员工/普通职员</option>
            <option :value="4">管理/自营/专业人员</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">您的家庭负担人数是？</label>
        <div class="select-wrapper">
          <select v-model.number="form.peopleLiable" class="form-select" :disabled="!editing" required>
            <option value="" disabled>请选择</option>
            <option :value="2">0到2人</option>
            <option :value="1">3人及以上</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">您目前是否拥有以下可证明资产？</label>
        <div class="select-wrapper">
          <select v-model.number="form.property" class="form-select" :disabled="!editing" required>
            <option value="" disabled>请选择</option>
            <option :value="1">无可证明资产</option>
            <option :value="2">有车辆或一般资产</option>
            <option :value="3">有储蓄/保险类资产证明</option>
            <option :value="4">有房产证明</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button v-if="isCompleted && !editing" type="button" class="submit-btn edit-btn" @click="enableEdit">
          修改个人信息
        </button>
        <div v-if="editing" class="edit-actions">
          <button v-if="isCompleted" type="button" class="submit-btn cancel-btn" @click="cancelEdit">
            取消
          </button>
          <button type="submit" class="submit-btn save-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : '保存' }}
          </button>
          <button v-if="!isCompleted" type="submit" class="submit-btn save-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交' }}
          </button>
        </div>

      </div>
    </form>

    <div class="modal" v-if="showResultModal">
      <div class="modal-content">
        <div class="modal-body">
          <div class="result-icon" :class="resultSuccess ? 'success' : 'error'">
            {{ resultSuccess ? '✓' : '✕' }}
          </div>
          <p class="result-message">{{ resultMessage }}</p>
        </div>
        <button class="modal-btn" @click="handleResultConfirm">
          {{ resultSuccess ? '返回个人中心' : '知道了' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfo',
  data() {
    return {
      form: {
        age: '',
        housing: '',
        employmentDuration: '',
        job: '',
        peopleLiable: '',
        property: ''
      },
      originalForm: null,
      editing: false,
      submitting: false,
      showResultModal: false,
      resultSuccess: false,
      resultMessage: ''
    }
  },
  computed: {
    isCompleted() {
      return localStorage.getItem('riskProfileCompleted') === 'true'
    }
  },
  created() {
    this.loadSavedData()
    this.editing = !this.isCompleted
  },
  methods: {
    loadSavedData() {
      const saved = localStorage.getItem('riskProfileData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          this.form.age = data.age || ''
          this.form.housing = data.housing || ''
          this.form.employmentDuration = data.employmentDuration || ''
          this.form.job = data.job || ''
          this.form.peopleLiable = data.peopleLiable || ''
          this.form.property = data.property || ''
        } catch (e) {
          console.error('解析个人信息缓存失败:', e)
        }
      }
    },

    enableEdit() {
      this.originalForm = { ...this.form }
      this.editing = true
    },

    cancelEdit() {
      if (this.originalForm) {
        this.form = { ...this.originalForm }
        this.originalForm = null
      }
      this.editing = false
    },

    goBack() {
      this.$router.push('/profile')
    },

    async submitForm() {
      if (!this.form.age) {
        this.showResult('请填写年龄', false)
        return
      }
      if (!this.form.housing) {
        this.showResult('请选择居住情况', false)
        return
      }
      if (!this.form.employmentDuration) {
        this.showResult('请选择工作年限', false)
        return
      }
      if (!this.form.job) {
        this.showResult('请选择职业情况', false)
        return
      }
      if (!this.form.peopleLiable) {
        this.showResult('请选择家庭负担人数', false)
        return
      }
      if (!this.form.property) {
        this.showResult('请选择资产情况', false)
        return
      }

      this.submitting = true

      try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          this.showResult('请先登录', false)
          this.submitting = false
          return
        }

        var myHeaders = new Headers()
        myHeaders.append('Authorization', accessToken)
        myHeaders.append('Content-Type', 'application/json')

        var raw = JSON.stringify({
          age: this.form.age,
          housing: this.form.housing,
          employmentDuration: this.form.employmentDuration,
          job: this.form.job,
          peopleLiable: this.form.peopleLiable,
          property: this.form.property
        })

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        }

        const response = await fetch('http://115.190.40.44:45444/user/riskProfile', requestOptions)
        const result = await response.text()
        console.log('提交个人信息响应:', result)

        const responseData = JSON.parse(result)

        if (responseData.success) {
          localStorage.setItem('riskProfileCompleted', 'true')
          localStorage.setItem('riskProfileData', JSON.stringify({
            age: this.form.age,
            housing: this.form.housing,
            employmentDuration: this.form.employmentDuration,
            job: this.form.job,
            peopleLiable: this.form.peopleLiable,
            property: this.form.property
          }))
          this.editing = false
          this.originalForm = null
          this.showResult('个人信息提交成功', true)
        } else {
          this.showResult(responseData.message || '提交失败，请重试', false)
        }
      } catch (error) {
        console.error('提交个人信息失败:', error)
        if (error.message.includes('Failed to fetch')) {
          this.showResult('网络错误，无法连接到服务器', false)
        } else {
          this.showResult('提交失败，请重试', false)
        }
      } finally {
        this.submitting = false
      }
    },

    showResult(message, success) {
      this.resultMessage = message
      this.resultSuccess = success
      this.showResultModal = true
    },

    handleResultConfirm() {
      this.showResultModal = false
      if (this.resultSuccess) {
        this.$router.push('/profile')
      }
    }
  }
}
</script>

<style scoped>
.personal-info {
  min-height: 100vh;
  padding: 16px 14px 40px;
  background:
    radial-gradient(circle at 18% 4%, rgba(50, 179, 151, 0.22), transparent 30%),
    radial-gradient(circle at 86% 10%, rgba(255, 148, 94, 0.22), transparent 28%),
    linear-gradient(180deg, #edf7f5 0%, #f7f3ec 42%, #f4f6fb 100%);
  color: #18212c;
}

.page-header {
  position: relative;
  overflow: hidden;
  padding: 22px;
  margin-bottom: 16px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(20, 39, 68, 0.96), rgba(23, 115, 108, 0.92) 56%, rgba(255, 136, 87, 0.9));
  color: #fff;
  box-shadow: 0 18px 42px rgba(28, 88, 103, 0.24);
  text-align: left;
}

.page-header::after {
  content: "";
  position: absolute;
  right: -34px;
  top: -44px;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.back-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px 6px 8px;
  margin-bottom: 10px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateX(-2px);
}

.back-arrow {
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
}

.back-text {
  font-size: 14px;
}

.page-title {
  position: relative;
  z-index: 1;
  margin: 0 0 8px;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
}

.page-subtitle {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.76);
  font-weight: 700;
}

.info-form {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 16px 36px rgba(32, 55, 76, 0.1);
  backdrop-filter: blur(18px);
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 900;
  color: #25303d;
}

.form-input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: #f6f8fa;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
  font-size: 15px;
  color: #26313d;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(50, 179, 151, 0.35);
}

.form-input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  height: 46px;
  padding: 0 36px 0 14px;
  border: 0;
  border-radius: 16px;
  background: #f6f8fa;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
  font-size: 15px;
  color: #26313d;
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.form-select:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(50, 179, 151, 0.35);
}

.form-select:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.select-wrapper::after {
  content: "▼";
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #7b8794;
  pointer-events: none;
}

.form-actions {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.edit-btn {
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  color: #fff;
  box-shadow: 0 14px 28px rgba(23, 115, 108, 0.28);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(23, 115, 108, 0.32);
}

.save-btn {
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  color: #fff;
  box-shadow: 0 14px 28px rgba(23, 115, 108, 0.28);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(23, 115, 108, 0.32);
}

.cancel-btn {
  background: #f5f7fa;
  color: #667280;
  box-shadow: inset 0 0 0 1px rgba(231, 235, 241, 0.9);
}

.cancel-btn:hover {
  transform: translateY(-1px);
  background: #eef1f5;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 29, 43, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 320px;
  padding: 28px 24px 20px;
  text-align: center;
  box-shadow: 0 24px 58px rgba(13, 31, 46, 0.28);
}

.modal-body {
  margin-bottom: 18px;
}

.result-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 900;
}

.result-icon.success {
  background: linear-gradient(135deg, #20b883, #75c045);
  color: #fff;
}

.result-icon.error {
  background: linear-gradient(135deg, #ff8a3d, #ef4056);
  color: #fff;
}

.result-message {
  font-size: 15px;
  color: #25303d;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
}

.modal-btn {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #142744, #17736c 56%, #ff8857);
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(23, 115, 108, 0.22);
  transition: transform 0.18s ease;
}

.modal-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .personal-info {
    padding: 14px 12px 32px;
  }

  .info-form {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .page-header {
    padding: 18px;
  }

  .back-btn {
    padding: 5px 12px 5px 6px;
  }
}
</style>
