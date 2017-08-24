# a node js website with firebase to login and webrtc to video chat

This website allow user to login with their firebase account and then start video chat with other users. I have tested video chat with other clients from Android and PC browser.

This project is modified based on existing sever code from https://github.com/pchab/ProjectRTC

I add firebase connection to this server and defined several socket message type. Change angular js module by sending firebase id, stop camera logic and remove stream after getting disconnected message. 
