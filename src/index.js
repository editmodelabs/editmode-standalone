import { 
  domReady, api, getCachedData, storeCache,
  setBranchId, logger, getTimedCachedData, storeTimedCache
} from './utils'
import Component from "./components"

const EditmodeStandAlone = {
  projectId: null,
  branchId: setBranchId(),
  defaultChunks: [],

  // Initialize
  start: async function () {
    console.log('Discovering contents...')

    await domReady() 

    this.attachWatermark()
    this.discoverContents()
    this.addMagicEditorPlugin()

    window.chunksProjectIdentifier = this.projectId
  },

  attachWatermark: function() {
    const div = document.createElement('div')
    div.innerHTML = `<div style="z-index: 9999; bottom: 8px; right: 8px; position: fixed; opacity: 1; display: flex; align-items: center; background: rgba(255, 255, 255, 0.9); cursor: pointer; border-radius: 5px; padding: 2px 5px 2px 2px; box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 548 532" version="1.1" fill="currentColor"><g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-2-Copy" fill="#02164B" fill-rule="nonzero"><path d="M355.57238,93.227099 C421.07938,126.760445 463.228656,200.366589 458.662484,275.197013 C456.789183,321.18219 437.646387,365.465318 406.824729,398.879222 C371.729602,436.503458 321.735878,458.271766 270.922584,458.988418 C203.22031,459.764791 137.596229,421.453764 104.754918,360.956382 C83.2997657,322.496052 75.4553171,276.928922 82.5387371,233.302725 C89.0952911,193.767417 107.828303,156.501508 135.840009,128.343052 C167.861751,95.3770553 211.620895,75.6989829 256.902096,72.4143274 C290.88495,70.1150686 325.248318,77.4308922 355.57238,93.227099 Z M302.597364,108.707879 C244.580186,94.7144282 181.478422,121.295874 147.91428,172.136709 C125.753716,204.951046 116.495656,247.175826 123.079165,286.681355 C127.575938,318.48743 142.800303,348.796389 164.461226,371.680876 C195.556552,404.281339 240.406711,421.818983 284.492713,417.297082 C306.976574,415.738859 326.903446,407.153357 347.094835,397.529041 C333.927816,397.406827 321.113485,400.462166 307.975856,399.881651 C293.691992,399.33169 279.114221,397.284614 265.565123,392.487732 C232.823919,381.213532 204.168018,358.573473 185.916413,328.020087 C170.074843,302.721883 162.668395,271.465768 167.841152,241.52345 C172.896347,214.850343 187.297774,190.224314 208.429665,174.061573 C244.874093,144.791428 299.77586,145.463603 335.750037,175.344815 C370.842495,203.117843 385.273313,253.25595 370.783713,296.550099 C362.524936,322.978778 344.831754,343.357887 322.553628,358.145726 C342.069031,355.12094 360.261854,348.643622 375.985862,336.025074 C406.7285,312.315646 423.275446,271.129681 418.043907,231.715813 C408.727065,170.822914 360.320636,120.89868 302.597364,108.707879 Z M322.507627,229.728263 C308.735553,203.164192 276.64924,189.629307 248.46453,198.136949 C218.823998,206.287627 198.529842,236.927037 201.907349,268.072146 C204.498711,292.375445 220.017772,314.804683 242.932407,323.074349 C267.302864,332.68263 295.895205,325.930061 313.510648,306.148306 C331.970469,285.593129 335.813839,254.180297 322.507627,229.728263 Z" id="Combined-Shape"></path></g></g></svg><span style="font-size: 13px; font-weight: 600;">Powered by Editmode</span></div>`

    const cacheId =  this.projectId + "_provider"
    let project = getTimedCachedData(cacheId)

    if (!project) {
      api(`/projects/${this.projectId}`)
          .then((res) => {
            storeTimedCache(cacheId, res.data);
            project = res
            if ( project.has_watermark ) {
              document.body.append(div)
            }
          })
          .catch((error) => {
            console.error(error);
          });
    } else {
      if ( project.has_watermark ) {
        document.body.append(div)
      }
    }
  },

  discoverContents: function() {
    this.discoverChunks(el => {
      this.getChunk(el)
    })

    this.discoverCollections(el => {
      this.getCollection(el)
    })
  },

  // Scan DOM Search for tags with chunk-id attr
  discoverChunks: function(callback) {
    const chunkElements = document.querySelectorAll('[chunk-id]');

    chunkElements.forEach(el => {
      callback(el)
    })
  },

  // Get chunk data from Editmode API
  getChunk: function(el) {
    const chunkId = el.getAttribute('chunk-id')
    const chunkProjectId = el.getAttribute('project-id')
    const cacheid = chunkId + this.projectId + this.branchId
    const cacheData = getCachedData(cacheid)
    
    if (cacheData) {
      logger('Rendering from cache: ' + chunkId)
      Component.renderChunk(el, cacheData)
    }

    // Render from default chunk
    if (!cacheData && this.defaultChunks.length) {
      logger('Rendering from defaultChunks: ' + chunkId)
      let chunk = this.defaultChunks.find(c => c.identifier == chunkId )
      storeCache(cacheid, chunk)
      Component.renderChunk(el, chunk)
    }

    api(`/chunks/${chunkId}`, 
      { 
        parameters: { 
          project_id: chunkProjectId || this.projectId,
          branch_id: this.branchId
        }
      }
    ).then(chunk => {
      storeCache(cacheid, chunk)

      // If no cache data, render content from API
      if (!cacheData && !this.defaultChunks.length) {
        logger('Rendering from API: ' + chunkId)
        Component.renderChunk(el, chunk)
      }
    })
  },

  // Scan DOM Search for collection tags
  discoverCollections: function(callback) {
    const collectionElements = document.querySelectorAll('template[collection-id]')

    collectionElements.forEach(el => {
      callback(el)
    })
  },

   // Get collection data from Editmode API
  getCollection: function(el) {
    const collectionId = el.getAttribute('collection-id')
    const chunkProjectId = el.getAttribute('project-id')
    const limit = el.getAttribute('limit')
    let tags = el.getAttribute('tags') || ""
    tags = tags.split(" ").filter(Boolean) // Filter boolean will remove empty strings

    const cacheid = collectionId + this.projectId + this.branchId + tags.join("")
    const cacheData = getCachedData(cacheid)

    if (cacheData) {
      logger('Rendering from cache: ' + collectionId)
      Component.renderCollection(el, cacheData, limit, tags)
    }

    if (!tags.length && !cacheData && this.defaultChunks.length) {
      logger('Rendering from defaultChunks: ' + collectionId)
      let chunks = this.defaultChunks.filter(c => c.collection && c.collection.identifier == collectionId)
      storeCache(cacheid, chunks)
      Component.renderCollection(el, chunks, limit, tags)
    }

    api("/chunks/", 
      {
        parameters: {
          collection_identifier: collectionId,
          project_id: chunkProjectId || this.projectId,
          branch_id: this.branchId,
          tags: tags
        }
      }).then(res => {
        let chunks = res.chunks
        storeCache(cacheid, chunks)

        if (!cacheData && !this.defaultChunks.length) {
          logger('Rendering from defaultChunks: ' + collectionId)
          Component.renderCollection(el, chunks, limit, tags)
        }
      })
  },

  // Add magic editor plugin script tag before closing body tag
  addMagicEditorPlugin: function() {
    let s = document.createElement('script')
    let url =  "https://unpkg.com/editmode-magic-editor@~1/dist/magic-editor.js"
    if(window.editmodeMagicEditorUrl) url = window.editmodeMagicEditorUrl
    s.setAttribute('src', url)
    s.async = true

    document.body.appendChild( s )
  }
}


window.EditmodeStandAlone = EditmodeStandAlone
window.EditmodeStandAlone.start()

export default EditmodeStandAlone
