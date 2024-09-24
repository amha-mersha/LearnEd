import React from 'react'
import SidebarRelaxed from './SidebarRelaxed'
import { useSelector } from 'react-redux'
import SidebarCollapsed from './SidebarCollapsed'

const Sidebar = () => {
  const relaxed = useSelector((state:any) => state.hamburger.value)
  if (relaxed){
    return (
      <div>
          <SidebarRelaxed/>
      </div>
    )
  }
  else{
    return (
      <div>
          <SidebarCollapsed/>
      </div>
    )
  }

}

export default Sidebar