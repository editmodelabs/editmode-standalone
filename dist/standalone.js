(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EditmodeStandAlone = factory());
}(this, (function () { 'use strict';

  async function api(path) {
    return fetch("https://api.editmode.com" + path, {
      method: 'get',
      headers: {
        Accept: "application/json",
        referrer: window.location.href
      }
    }).then(response => response.json());
  }

  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts

  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }

  const Component = {
    renderChunk: function renderChunk(el, chunk, collectionItem = null) {
      const isNotEditable = el.getAttribute('editable') === false;
      el.dataset.chunk = chunk.identifier;
      el.dataset.chunkType = chunk.chunk_type;
      el.dataset.chunkEditable = !isNotEditable;

      if (collectionItem) {
        el.dataset.parentIdentifier = collectionItem.identifier;
        el.dataset.customFieldIdentifier = chunk.custom_field_identifier;
      }

      if (chunk.chunk_type == 'rich_text') {
        el.classList.add("editmode-richtext-editor");
      }

      if (chunk.chunk_type == 'image') {
        el.src = chunk.content || "https://editmode.com/upload.png";
      } else {
        el.innerHTML = chunk.content;
      }

      return el;
    },
    renderCollection: function renderCollection(el, collectionItems) {
      const collectionContainer = document.createElement('div');
      const containerClass = el.getAttribute('class') || "";

      if (collectionItems.length) {
        collectionContainer.setAttribute('class', `${containerClass} chunks-collection-wrapper`);
        collectionContainer.dataset.chunkCollectionIdentifier = collectionItems[0].collection.identifier;
        collectionItems.forEach(collectionItem => {
          const itemWrapper = this.createCollectionItem(el, collectionItem);
          collectionContainer.appendChild(itemWrapper);
        }); // Info: We add hidden item to every collection so we can use
        // this el as template for a new collection item 

        const dummyItem = this.createCollectionItem(el, collectionItems[0], true);
        collectionContainer.appendChild(dummyItem);
        el.replaceWith(collectionContainer);
      } else {
        const emptyCollectionEl = document.createElement('div');
        emptyCollectionEl.style.display = "none";
        emptyCollectionEl.innerText = "No Collection Item Found";
        el.replaceWith(emptyCollectionEl);
        console.warn("No collection item found for collection_id: " + el.getAttribute('collection-id'));
      }
    },
    createCollectionItem: function createCollectionItem(el, item, dummy = false) {
      let template = el.innerHTML;
      const fields = el.content.querySelectorAll("[field-id]");
      const itemWrapper = document.createElement('div');
      const itemClass = el.getAttribute('itemClass') || "";
      itemWrapper.setAttribute('class', itemClass);

      if (dummy) {
        // Info: Line 42
        itemWrapper.classList.add("chunks-hide");
        itemWrapper.classList.add("chunks-col-placeholder-wrapper");
      } else {
        itemWrapper.classList.add("chunks-collection-item--wrapper");
      }

      const fieldChunks = item.content;
      fields.forEach(fieldTemplate => {
        const fieldChunkData = fieldChunks.find(fieldChunk => fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_identifier || fieldTemplate.getAttribute('field-id') === fieldChunk.custom_field_name);
        if (dummy) fieldChunkData.content = ""; // Info: Line 42

        const cloneFieldElement = fieldTemplate.cloneNode(true);
        const newComponent = this.renderChunk(cloneFieldElement, fieldChunkData, item, dummy);
        template = template.replace(fieldTemplate.outerHTML, newComponent.outerHTML);
      });
      itemWrapper.innerHTML = template;
      return itemWrapper;
    }
  };

  const EditmodeStandAlone = {
    projectId: null,
    // Initialize
    start: async function start() {
      console.log('Discovering contents...');
      await domReady();
      this.discoverContents();
      this.addMagicEditorPlugin();
      window.chunksProjectIdentifier = this.projectId;
    },
    discoverContents: function discoverContents() {
      this.discoverChunks(el => {
        this.getChunk(el);
      });
      this.discoverCollections(el => {
        this.getCollection(el);
      });
    },
    // Scan DOM Search for tags with chunk-id attr
    discoverChunks: function discoverChunks(callback) {
      const chunkElements = document.querySelectorAll('[chunk-id]');
      chunkElements.forEach(el => {
        callback(el);
      });
    },
    // Get chunk data from Editmode API
    getChunk: function getChunk(el) {
      const chunkId = el.getAttribute('chunk-id');
      const chunkProjectId = el.getAttribute('project-id');
      api(`/chunks/${chunkId}?project_id=${chunkProjectId || this.projectId}`).then(res => {
        const chunk = res;
        Component.renderChunk(el, chunk);
      });
    },
    // Scan DOM Search for collection tags
    discoverCollections: function discoverCollections(callback) {
      const collectionElements = document.querySelectorAll('template[collection-id]');
      collectionElements.forEach(el => {
        callback(el);
      });
    },
    // Get collection data from Editmode API
    getCollection: function getCollection(el) {
      const collectionId = el.getAttribute('collection-id');
      const chunkProjectId = el.getAttribute('project-id');
      const urlParams = new URLSearchParams({
        collection_identifier: collectionId,
        projectId: chunkProjectId || this.projectId
      });
      api(`/chunks/?${urlParams}`).then(res => {
        const chunks = res.chunks;
        Component.renderCollection(el, chunks);
      });
    },
    // Add magic editor plugin script tag before closing body tag
    addMagicEditorPlugin: function addMagicEditorPlugin() {
      var s = document.createElement('script');
      s.setAttribute('src', "https://static.editmode.com/editmode@^2.0.0/dist/editmode.js");
      s.async = true;
      document.body.appendChild(s);
    }
  };
  window.EditmodeStandAlone = EditmodeStandAlone;
  window.EditmodeStandAlone.start();

  return EditmodeStandAlone;

})));
