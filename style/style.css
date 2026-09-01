* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  background: #1a1a1a;
  color: #eaeaea;
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: 100vh;
  cursor: url("./img/birthday-cake.png") 8 8, auto;
}

/* Preloader */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  transition: opacity 0.8s, visibility 0.8s;
}

.preloader.loaded {
  opacity: 0;
  visibility: hidden;
}

.preloader-content {
  text-align: center;
}

.preloader h2 {
  font-family: "Great Vibes", cursive;
  font-size: 3.5rem;
  color: #ff4da6;
  margin-bottom: 30px;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-bar {
  width: 300px;
  height: 8px;
  background: rgba(255, 77, 166, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px auto;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff4da6, #ffd54f, #00e5ff);
  border-radius: 10px;
  width: 0%;
  transition: width 0.3s ease;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.loading-text {
  color: #00e5ff;
  font-size: 1.2rem;
  margin-top: 15px;
}

/* Card Section */
.card-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  transition: opacity 0.8s, visibility 0.8s;
  opacity: 0;
  visibility: hidden;
}

.card-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.card-overlay.hidden {
  opacity: 0;
  visibility: hidden;
}

.birthday-card {
  width: 420px;
  height: 550px;
  position: relative;
  transform-style: preserve-3d;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
  transition: transform 0.8s;
}

.birthday-card.opened {
  transform: rotateY(-180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  box-shadow: 0 25px 70px rgba(255, 77, 166, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  border: 2px solid rgba(255, 77, 166, 0.3);
}

.card-front {
  background: linear-gradient(135deg, #ff4da6 0%, #ffd54f 100%);
}

.card-back {
  background: linear-gradient(135deg, #00e5ff 0%, #ff4da6 100%);
  transform: rotateY(180deg);
}

.envelope-icon {
  font-size: 100px;
  margin-bottom: 30px;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}

.card-front h1 {
  font-family: "Great Vibes", cursive;
  font-size: 52px;
  color: #1a1a1a;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.card-front p {
  font-size: 22px;
  color: #1a1a1a;
  text-align: center;
  font-weight: 300;
}

.card-back h2 {
  font-family: "Great Vibes", cursive;
  font-size: 48px;
  color: #ffffff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  margin-bottom: 30px;
  text-align: center;
}

.card-back p {
  color: #ffffff;
  font-size: 20px;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30px;
}

.open-btn {
  padding: 18px 50px;
  font-size: 20px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  background: #ffd54f;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
  box-shadow: 0 8px 20px rgba(255, 213, 79, 0.4);
  transition: all 0.3s;
}

.open-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 30px rgba(255, 213, 79, 0.6);
}

/* Main Timeline Container */
.timeline-container {
  display: none;
  min-height: 100vh;
  position: relative;
  visibility: hidden;
}

.timeline-container.active {
  display: block;
}

.timeline-container > div {
  position: absolute;
  left: 0;
  right: 0;
  top: 20vh;
  text-align: center;
}

/* Timeline Sections */
.section-one {
  font-size: 4.5rem;
  font-family: "Great Vibes", cursive;
  color: #ff4da6;
}

.section-one span {
  color: #ffd54f;
}

.section-two {
  font-size: 1.5rem;
  font-weight: 300;
  color: #00e5ff;
  padding-top: 20rem;
}

.section-three {
  font-size: 3.5rem;
  font-weight: 600;
  color: #ff4da6;
}

.section-four .text-box {
  border: 3px solid #ff4da6;
  border-radius: 15px;
  margin: 0 auto;
  padding: 30px 30px 70px 30px;
  position: relative;
  width: 700px;
  max-width: 90%;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
}

.text-box p {
  margin: 0;
  text-align: left;
  color: #eaeaea;
  line-height: 1.8;
  font-size: 18px;
}

.text-box span {
  visibility: hidden;
}

.text-box .fake-btn {
  background: linear-gradient(135deg, #00e5ff 0%, #ff4da6 100%);
  border-radius: 8px;
  color: #1a1a1a;
  padding: 12px 30px;
  position: absolute;
  bottom: -80px;
  right: 20px;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(255, 77, 166, 0.4);
  transition: all 0.2s ease;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
  display: inline-block;
  visibility: visible !important;
}

.section-five p {
  font-size: 2.2rem;
  position: absolute;
  left: 0;
  right: 0;
  color: #eaeaea;
}

.section-five .idea-3 strong {
  background: linear-gradient(135deg, #ff4da6 0%, #ffd54f 100%);
  border-radius: 8px;
  display: inline-block;
  padding: 5px 15px;
  color: #1a1a1a;
}

.section-five .idea-5 {
  font-size: 4.5rem;
  font-family: "Dancing Script", cursive;
  color: #ffd54f;
  text-shadow: 2px 2px 4px rgba(255, 77, 166, 0.3);
  letter-spacing: 1px;
}

.idea-5 span,
.idea-6 span {
  display: inline-block;
}

.idea-6 span {
  font-size: 15rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff4da6 0%, #ffd54f 50%, #00e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Birthday Wish Section */
.section-six {
  position: relative;
  top: 3vh;
}

.profile-picture {
  width: 350px;
  height: 350px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #ff4da6;
  box-shadow: 0 15px 40px rgba(255, 77, 166, 0.5);
}

.hat {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -15%;
  width: 100px;
  font-size: 80px;
}

.wish {
  margin-top: 15px;
}

.wish-hbd {
  font-size: 4.2rem;
  font-family: "Pacifico", cursive;
  margin: 20px 0;
  text-transform: none;
  color: #ff4da6;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
}

.wish-hbd span {
  display: inline-block;
}

.wish h5 {
  font-size: 1.8rem;
  font-weight: 300;
  margin: 20px 0;
  color: #00e5ff;
}

/* Enhanced Cake Section */
.section-cake {
  position: absolute;
  left: 0;
  right: 0;
  top: 15vh;
  text-align: center;
}

.cake-title {
  font-family: "Great Vibes", cursive;
  font-size: 3.5rem;
  color: #ffd54f;
  margin-bottom: 40px;
  text-shadow: 0 5px 15px rgba(255, 213, 79, 0.5);
}

.cake-wrapper {
  position: relative;
  display: inline-block;
  margin-top: 20px;
}

/* Realistic Cake Design */
.realistic-cake {
  position: relative;
  width: 250px;
  height: 200px;
  margin: 0 auto;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
}

.plate {
  width: 270px;
  height: 110px;
  position: absolute;
  bottom: -10px;
  left: -10px;
  background-color: #ccc;
  border-radius: 50%;
  box-shadow: 0 2px 0 #b3b3b3, 0 4px 0 #b3b3b3, 0 5px 40px rgba(0, 0, 0, 0.5);
}

.layer {
  position: absolute;
  display: block;
  width: 250px;
  height: 100px;
  border-radius: 50%;
  background-color: #553c13;
  box-shadow: 0 2px 0px #6a4b18, 0 4px 0px #33240b, 0 6px 0px #32230b,
    0 8px 0px #31230b, 0 10px 0px #30220b, 0 12px 0px #2f220b;
}

.layer-top {
  top: 0px;
}
.layer-middle {
  top: 33px;
}
.layer-bottom {
  top: 66px;
}

.icing {
  top: 2px;
  left: 5px;
  background-color: #f0e4d0;
  width: 240px;
  height: 90px;
  border-radius: 50%;
  position: absolute;
}

.icing:before {
  content: "";
  position: absolute;
  top: 4px;
  right: 5px;
  bottom: 6px;
  left: 5px;
  background-color: #f4ebdc;
  box-shadow: 0 0 4px #f6efe3;
  border-radius: 50%;
  z-index: 1;
}

.drip {
  display: block;
  width: 50px;
  height: 60px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  background-color: #f0e4d0;
  position: absolute;
}

.drip1 {
  top: 53px;
  left: 5px;
  transform: skewY(15deg);
  height: 48px;
  width: 40px;
}

.drip2 {
  top: 69px;
  left: 181px;
  transform: skewY(-15deg);
}

.drip3 {
  top: 54px;
  left: 90px;
  width: 80px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}

.candle {
  background-color: #7b020b;
  width: 12px;
  height: 35px;
  border-radius: 6px/3px;
  position: absolute;
  z-index: 10;
}

.candle:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 6px;
  border-radius: 50%;
  background-color: #ad030f;
}

.candle.out .flame {
  display: none;
}

.flame {
  position: absolute;
  background-color: orange;
  width: 10px;
  height: 25px;
  border-radius: 8px 8px 8px 8px/20px 20px 8px 8px;
  top: -34px;
  left: 1px;
  z-index: 10;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5),
    0 0 60px rgba(255, 165, 0, 0.5);
  transform-origin: 50% 90%;
  animation: flicker 1s ease-in-out alternate infinite;
}

@keyframes flicker {
  0% {
    transform: skewX(5deg);
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.2);
  }
  50% {
    transform: skewX(-5deg);
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5);
  }
  100% {
    transform: skewX(5deg);
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5);
  }
}

.blow-instruction {
  margin-top: 50px;
  font-size: 1.8rem;
  color: #00e5ff;
  font-family: "Poppins", sans-serif;
  animation: pulse 2s infinite;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.blown-message {
  margin-top: 40px;
  font-size: 2.5rem;
  color: #ffd54f;
  font-family: "Great Vibes", cursive;
  display: none;
}

.blown-message.show {
  display: block;
  animation: fadeInScale 1s;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Final Section */
.section-nine {
  opacity: 0;
}

.section-nine p {
  font-size: 2rem;
  font-weight: 300;
  color: #eaeaea;
}

#replay {
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
  color: #00e5ff;
  text-decoration: none;
  transition: all 0.3s;
}

#replay:hover {
  color: #ff4da6;
  transform: scale(1.05);
}

.last-smile {
  font-size: 3rem;
  color: #ffd54f;
}

/* Balloons */
.balloon {
  position: fixed;
  bottom: -150px;
  font-size: 60px;
  animation: float-up 10s ease-in infinite;
  z-index: 100;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
}

@keyframes float-up {
  0% {
    bottom: -150px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    bottom: 110vh;
    opacity: 0;
  }
}

/* Fireworks */
.firework {
  position: fixed;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  z-index: 50;
}

/* Confetti */
.confetti {
  position: fixed;
  width: 12px;
  height: 12px;
  z-index: 50;
  animation: confetti-fall 4s linear infinite;
}

@keyframes confetti-fall {
  0% {
    top: -20px;
    opacity: 1;
    transform: rotate(0deg);
  }
  100% {
    top: 110vh;
    opacity: 0.5;
    transform: rotate(720deg);
  }
}

/* Music Control */
.music-control {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #ff4da6 0%, #ffd54f 100%);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: none;
  justify-content: center;
  align-items: center;
  cursor: url("./img/birthday-candle.png") 6 2, pointer;
  box-shadow: 0 8px 25px rgba(255, 77, 166, 0.5);
  z-index: 9999;
  transition: all 0.3s;
}

.music-control:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 12px 35px rgba(255, 77, 166, 0.7);
}

.music-control span {
  font-size: 32px;
}

/* Responsive */
@media (max-width: 768px) {
  .birthday-card {
    width: 340px;
    height: 480px;
    padding: 30px;
  }
  .section-one {
    font-size: 3rem;
  }
  .section-three {
    font-size: 2.5rem;
  }
  .section-four .text-box {
    width: 90%;
    padding: 20px 20px 60px 20px;
  }
  .idea-6 span {
    font-size: 10rem;
  }
  .profile-picture {
    width: 250px;
    height: 250px;
  }
  .realistic-cake {
    transform: scale(0.8);
  }
  .wish-hbd {
    font-size: 3rem;
  }
}
