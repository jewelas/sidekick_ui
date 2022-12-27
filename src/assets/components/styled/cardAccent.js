import styled, { keyframes } from 'styled-components';

const rainbow = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`

const StyledCardAccent = styled.div`
background: linear-gradient(45deg,

rgba(79, 220, 74, 1) 40%,
rgba(63, 218, 216, 1) 60%,
rgba(47, 201, 226, 1) 70%,
rgba(28, 127, 238, 1) 100%);

background-size: 400% 400%;
animation: ${rainbow} 4s linear infinite;
border-radius: 10px;
filter: blur(3px);
position: absolute;
top: 21px;
right: 20px;
bottom: 68px;
left: 20px;
`

export { StyledCardAccent }