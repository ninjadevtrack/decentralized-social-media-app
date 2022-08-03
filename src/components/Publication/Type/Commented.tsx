import { LensterPublication } from '@generated/lenstertypes'
import React, { FC } from 'react'

import ThreadBody from '../ThreadBody'

interface Props {
  post: LensterPublication
}

const Commented: FC<Props> = ({ post }) => {
  const commentOn: LensterPublication | any = post?.commentOn
  const mainPost = commentOn?.mainPost
  const postType = mainPost?.metadata?.attributes[0]?.value

  return (
    <div>
      {mainPost && postType !== 'community' ? (
        <ThreadBody post={mainPost} />
      ) : null}
      <ThreadBody post={commentOn} />
    </div>
  )
}

export default Commented
