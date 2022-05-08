import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from 'firebase/compat/app'

function ImageUpload({ username }) {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)

    uploadTask.on(
      'state changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        console.log(error)
        alert(error.message)
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageURL: url,
              username: username,
            })
          })
      }
    )
  }

  return (
    <div>
      <input
        type='text'
        placeholder='Enter a caption...'
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload </Button>
    </div>
  )
}

export default ImageUpload
