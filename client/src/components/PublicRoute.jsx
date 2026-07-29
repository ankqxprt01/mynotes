import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PublicRoute({children}) {
    const navigate = useNavigate()
    useEffect(()=>{
    if(localStorage.getItem('token')){
        navigate('/')
    }
     // eslint-disable-next-line
    }, [])
  return (
    <div>
      {children}
    </div>
  )
}

export default PublicRoute
