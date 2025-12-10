// messageUtils.js
/*
* 用于跨文件调用函数
* 在flash_loan.html中贷款成功后
* */
const MessageUtils = {
    addMessageElement: function(time, title, content, bgColor) {
        console.log("正在执行新增消息操作")
        const msgItem = document.createElement('div');
        msgItem.className = 'msg-item';
        msgItem.style.background = bgColor;
        msgItem.innerHTML = `
            <div class="msg-time">${time}</div>
            <div class="msg-content">${title}</div>
            <div class="msg-detail">${content}</div>
        `;

        msgItem.addEventListener('click', function() {
            alert(`消息详情\n\n${title}\n${content}`);
        });

        const messageList = document.getElementById('messageList');
        if (messageList) {
            messageList.insertBefore(msgItem, messageList.firstChild);
        }
    },
    generateApplyMessage: function() {
        console.log("正在执行生成消息操作")
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        const Type = messageTypes[1];
        const Content = "贷款申请成功，正在等待审核";

        return {
            time: formattedTime,
            title: Type.type,
            content: Content,
            bgColor: Type.bgColor
        };
    }
};
const messageTypes = [
    { type: "系统通知", bgColor: "#E0F7FA" },
    { type: "交易提醒", bgColor: "#FFF3E0" },
    { type: "营销活动", bgColor: "#F3E5F5" },
    { type: "客服消息", bgColor: "#E3F2FD" },
    { type: "额度调整", bgColor: "#E8F5E9" }
];
// function generateApplyMessage() {
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
//
//     const Type = messageTypes[1];
//     const Content = "贷款申请成功，正在等待审核";
//
//     return {
//         time: formattedTime,
//         title: Type.type,
//         content: Content,
//         bgColor: Type.bgColor
//     };
// }
// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageUtils;
} else {
    window.MessageUtils = MessageUtils;
}
