          openingSpeech +
          '\n</opening_words>',
      },
    })

    // The cadet's voice is locally recorded throughout. The AI-bound mic
    // stays muted during the introduction and while each question is read twice.
    if (!introductionFinished) {
      status.textContent =
        'Introduction playing. Your microphone is muted to the examiner.'
    }


  } catch (error) {

    console.error(error)


    if (
      mediaRecorder &&
      mediaRecorder.state !== 'inactive'
    ) {
      mediaRecorder.stop()
    }


    if (session) {
      session.close()
      session = null
    }


    if (examinerInputStream) {
      examinerInputStream.getTracks().forEach(track => track.stop())
      examinerInputStream = null
    }

    if (microphoneStream) {

      microphoneStream
        .getTracks()
        .forEach(track => track.stop())

      microphoneStream = null
    }


    showPortalPhase('rules')
    rulesError.hidden = false
    rulesError.textContent = 'Connection failed. Please check your internet connection and try again.'
    status.textContent = 'Connection failed.'

    startButton.disabled = false
    endButton.disabled = true
    practiceIdInput.disabled = false
    sectionInput.disabled = false
  }

})


endButton.addEventListener(
  'click',
  async () => {

    if (window.confirm('End and submit this examination now? Please complete the spoken honor acknowledgement first.')) {
      await stopExam()
    }

  }
)


downloadButton.addEventListener(
  'click',
  () => {

    if (!recordingUrl) {
      return
    }


    const link =
      document.createElement('a')


    link.href =
      recordingUrl


    link.download =
      createRecordingFilename()


    document.body.appendChild(link)

    link.click()

    link.remove()

  }
)

// Cadet may download emergency backups only if a submission fails.
// Backups intentionally do not include suggested grades or instructor comments.
downloadTranscriptButton.addEventListener('click', () => {
  if (!examCompletedAt || !recordingUrl) return
  const text = createCadetTranscriptText()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = createTranscriptFilename()
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
})
