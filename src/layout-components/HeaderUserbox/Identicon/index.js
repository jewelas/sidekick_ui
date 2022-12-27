import React, { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'
import { useWallet } from 'use-wallet';
import Jazzicon from 'jazzicon'

const StyledIdenticonContainer = styled.div`
  height: 1.9rem;
  width: 1.8rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.bg4};
`

export default function Identicon() {
  const ref = useRef()

  const user = useWallet();

  useEffect(() => {
    if (user.account !== null && user.account !== undefined && user.account > 0 && ref.current) {  
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(32, parseInt(user.account.slice(2, 10), 16)))
    }
  }, [user])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer ref={ref} />
}
