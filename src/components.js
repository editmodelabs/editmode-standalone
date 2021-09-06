import { parseVariable, setTransformAttributes } from './utils'

const Component = {
  renderChunk: function(el, chunk, collectionItem = null, dummy = false) {
    if (typeof chunk.content == 'undefined') return el

    const isNotEditable = el.getAttribute('editable') === false
    const transform = el.getAttribute('transform')
    let variables = el.getAttribute('variables')

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
      if (dummy) {
        const svgImage = this.createImagePlaceholder(el)
        el = svgImage
      } else {
        if (chunk.content && transform) {
          chunk.content = setTransformAttributes(chunk.content, transform)
        }
        el.src = chunk.content
      }

    } else {
      el.innerHTML = parseVariable(chunk.content, variables)
    }

    return el
  },

  renderCollection: function(el, collectionItems, limit = null, tags = []) {
    const collectionContainer = document.createElement('div')
    const containerClass = el.getAttribute('class') || ""

    // Limit item display
    if (limit) collectionItems = collectionItems.splice(0, limit)
    // Add tags in dataset
    if (tags.length) collectionContainer.dataset.chunkTags = tags.join("|")

    if (collectionItems.length) {
      collectionContainer.setAttribute('class', `${containerClass} chunks-collection-wrapper`)
      collectionContainer.dataset.chunkCollectionIdentifier = collectionItems[0].collection.identifier
      console.log(tags)

      collectionItems.forEach(collectionItem => {
        const itemWrapper = this.createCollectionItem(el, collectionItem)
        collectionContainer.appendChild(itemWrapper)
      })

      // Info: We add hidden item to every collection so we can use
      // this el as template for a new collection item 
      const dummyItem = this.createCollectionItem(el, collectionItems[0], true)
      
      collectionContainer.appendChild(dummyItem)
      el.replaceWith(collectionContainer)
    } else {
      const emptyCollectionEl = document.createElement('div')
      emptyCollectionEl.style.display = "none"
      emptyCollectionEl.innerText = "No Collection Item Found"
      el.replaceWith(emptyCollectionEl)
      console.warn("No collection item found for collection_id: " + el.getAttribute('collection-id'))
    }
  },

  createImagePlaceholder: function(originalEl) {
    const svgImage = document.createElement('svg')
    svgImage.classList = originalEl.classList.value
    svgImage.setAttribute('fill', 'currentColor')
    svgImage.setAttribute('viewBox', "0 0 20 20")
    svgImage.innerHTML = '<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>'
    Object.assign(svgImage.dataset, originalEl.dataset);
    return svgImage
  },

  createCollectionItem: function(el, item, dummy = false) {
    let template = el.innerHTML
    const fields = el.content.querySelectorAll("[field-id]")
    let itemWrapper = document.createElement('div')
    const itemClass = el.getAttribute('itemClass') || ""

    itemWrapper.setAttribute('class', itemClass)
    
    if (dummy) {
      itemWrapper = document.createElement('em-template')
      // Create Dummy Item for new collection item
      itemWrapper.classList.add("chunks-col-placeholder-wrapper")
      itemWrapper.style.display = "none"
    }else{
      itemWrapper.classList.add("chunks-collection-item--wrapper")
    }

    const fieldChunks = item.content

    fields.forEach(fieldTemplate => {
      const fieldChunkData = fieldChunks.find(fieldChunk => fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_identifier || fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_name) || {}

      if (dummy) fieldChunkData.content = "" // Info: Line 42

      const cloneFieldElement = fieldTemplate.cloneNode(true)

      const newComponent = this.renderChunk(cloneFieldElement, fieldChunkData, item, dummy) || fieldTemplate
      template = template.replace(fieldTemplate.outerHTML, newComponent.outerHTML)
    })

    itemWrapper.innerHTML = template

    return itemWrapper
  }

}

export default Component