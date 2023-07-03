import React from 'jsx-dom'

export const Tag = (renderView) => {
  const handleTagClick = async function () {
    await renderView();
  }
  return (
    <div className={'tree-tag'} onClick={handleTagClick}>
      &#128515;
    </div>
  )
}
