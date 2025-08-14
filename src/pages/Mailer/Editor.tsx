import React, { useEffect } from 'react'
import $ from 'jquery'

// Bootstrap (CSS + JS bundle includes Popper)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Expose jQuery globally for Summernote
declare global {
  interface Window {
    jQuery: typeof $
    $: typeof $
  }
}
window.$ = window.jQuery = $

// Extend jQuery typings
declare global {
  interface JQuery {
    summernote(...args: any[]): any
  }
}

const Editor = () => {
  useEffect(() => {
    const loadEditor = async () => {
      // Dynamically import jQuery first
      const $ = (await import('jquery')).default
      window.$ = window.jQuery = $ // expose globally

      // Dynamically import Summernote CSS + JS
      await import('summernote/dist/summernote-bs4.min.css')
      await import('summernote/dist/summernote-bs4.js')

      // Initialize Summernote
      $('#summernote').summernote({
        placeholder: 'Compose an awesome email...',
        height: 400,
        tabsize: 2,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']],
        ],
      })
    }

    loadEditor()

    return () => {
      if (window.$) {
        window.$('#summernote').summernote('destroy')
      }
    }
  }, [])

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Compose New Email</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label htmlFor="recipients" className="form-label fw-bold">
                Recipients
              </label>
              <input
                type="text"
                id="recipients"
                name="recipients"
                className="form-control"
                placeholder="Enter email addresses separated by commas"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subject" className="form-label fw-bold">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-control"
                placeholder="Enter subject"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="summernote" className="form-label fw-bold">
                Message
              </label>
              <textarea id="summernote" name="editordata" />
            </div>

            <div className="d-flex justify-content-end">
              <button type="reset" className="btn btn-outline-secondary me-2">
                Clear
              </button>
              <button type="submit" className="btn btn-primary">
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Editor
