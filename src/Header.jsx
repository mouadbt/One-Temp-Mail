import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="absolute h-min inset-0 w-full flex p-[5%] pt-[2%] pb-[2%] items-center justify-between z-50">
      <Link to="/">
        <img className='Logo w-32 saturate-0 brightness-200' src='/One-Temp-Mail-V2/LOGO.png' alt="free, temporary, email, disposable, mail, email address" />
      </Link>
      {/* <Link to="sms">Temp Number</Link> */}
    </header>
  )
}
