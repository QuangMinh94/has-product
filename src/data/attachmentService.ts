import axios from 'axios'
import { AttachmentResponse } from './database/Attachment'

export const RemoveAttachment = async (attachmentId: string) => {
  let attachmentResponse: AttachmentResponse = {
    FileName: '',
    FileType: '',
    DocumentId: '',
    Description: '',
    _id: '',
    __v: 0,
  }
  const serviceUrl = process.env.REACT_APP_API_ATTACHMENTS_REMOVEATTACHMENT!
  await axios
    .post(
      serviceUrl,
      {
        attachmentId: attachmentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      attachmentResponse = JSON.parse(JSON.stringify(res.data))
      return attachmentResponse
    })
    .catch(function (error) {
      console.log('Att ' + attachmentId)
      attachmentResponse.ErrorMessage = error.message
    })
  return attachmentResponse
}
