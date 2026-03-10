
import React from 'react'

const Spinner = ({title}) => {
     return (
          <div className="flex h-screen items-center justify-center bg-bg-page">
               <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-muted">Loading {title}</p>
               </div>
          </div>
     );
}

export default Spinner
