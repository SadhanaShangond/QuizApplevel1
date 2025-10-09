import React from 'react'
import clsx from 'clsx'
const Card = ({className,children}) => {
  return (
   <article className={clsx("card-wrapper",className)}>
    {children}
    </article>
  )
}

export default Card;