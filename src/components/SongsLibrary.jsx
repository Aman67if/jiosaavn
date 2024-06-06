import React from 'react'
import CardContainer from './CardContainer'

const SongsLibrary = () => {
  return (
    <div className='h-[81.6vh] w-full pl-12 overflow-auto'>
      <CardContainer id={'5LuU2TMq'} title={'Hindi Songs'}/>
      <CardContainer id={'Z09Owbpz'} title={'Bhojpuri Songs'}/>
      <CardContainer id={'yDeAS8Eh'} title={'English Songs'}/>
    </div>
  )
}

export default SongsLibrary
