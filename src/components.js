
const Component = {

  renderChunk: function(el, chunk, collectionItem = null) {
    const isNotEditable = el.getAttribute('editable') === false

    el.dataset.chunk = chunk.identifier
    el.dataset.chunkType = chunk.chunk_type
    el.dataset.chunkEditable = !isNotEditable

    if (collectionItem) {
      el.dataset.parentIdentifier = collectionItem.identifier
      el.dataset.customFieldIdentifier = chunk.custom_field_identifier
    }

    if (chunk.chunk_type == 'rich_text') {
      el.classList.add("editmode-richtext-editor")
    }

    if (chunk.chunk_type == 'image') {
      el.src = chunk.content
    } else {
      el.innerHTML = chunk.content
    }

    return el
  },

  renderCollection: function(el, collectionItems) {
    const collectionContainer = document.createElement('div')
    const containerClass = el.getAttribute('class') || ""

    if (collectionItems.length) {
      collectionContainer.setAttribute('class', `${containerClass} chunks-collection-wrapper`)
      collectionContainer.dataset.chunkCollectionIdentifier = collectionItems[0].collection.identifier

      // We add hidden item to every collection so we can use this el as template for a new collection item 

      collectionItems.forEach(collectionItem => {
        const itemWrapper = this.createCollectionItem(el, collectionItem)
        collectionContainer.appendChild(itemWrapper)
      })

      el.replaceWith(collectionContainer)
    } else {
      const emptyCollectionEl = document.createElement('div')
      emptyCollectionEl.style.display = "none"
      emptyCollectionEl.innerText = "No Collection Item Found"
      el.replaceWith(emptyCollectionEl)
      console.warn("No collection item found for collection_id: " + el.getAttribute('collection-id'))
    }
  },

  createCollectionItem: function(el, item) {
    let template = el.innerHTML
    const fields = el.querySelectorAll("[field-id]")
    const itemWrapper = document.createElement('div')
    const itemClass = el.getAttribute('itemClass') || ""
    
    itemWrapper.setAttribute('class', `${itemClass} chunks-collection-item--wrapper`)

    const fieldChunks = item.content

    fields.forEach(fieldTemplate => {
      const fieldChunkData = fieldChunks.find(fieldChunk => fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_identifier || fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_name)

      const cloneFieldElement = fieldTemplate.cloneNode(true)

      const newComponent = this.renderChunk(cloneFieldElement, fieldChunkData, item)
      template = template.replace(fieldTemplate.outerHTML, newComponent.outerHTML)
    })

    itemWrapper.innerHTML = template

    return itemWrapper
  }

}

export default Component