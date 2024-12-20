import { Box, TextInput } from '@mantine/core'
import { IconFolderOpen } from '@tabler/icons-react'
import React, { useContext, useState } from 'react'
import { apiUploadToS3 } from 'src/apis/backendApis/UploadAssetsApi'
import { AppContext } from 'src/context/AppContext'

const StepUploadToS3 = () => {
	const { arrImagesS3Links, setArrImagesS3Links } = useContext(AppContext)
	const [uploading, setUploading] = useState(false)
	const [folderName, setFolderName] = useState('test')

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setUploading(true)
		const files = event.target.files
		if (!files || files.length === 0) {
			console.error('No files selected')
			setUploading(false)
			return
		}
		console.log('handleFileUpload', files)

		const formData = new FormData()

		// Append each file individually
		Array.from(files).forEach((file) => {
			formData.append(`files`, file)
		})

		formData.append('folderName', folderName)

		// Log formData entries to verify content
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value)
		}

		try {
			const result = await apiUploadToS3(formData)
			console.log('Upload result:', result)
			setArrImagesS3Links(result)
			// Handle successful upload
		} catch (error) {
			console.error('Upload failed:', error)
			// Handle error
		} finally {
			setUploading(false)
		}
	}

	return (
		<>
			<Box className="flex align-middle justify-center">
				<div className="flex flex-col ">
					<TextInput
						className="mt-4"
						leftSectionPointerEvents="none"
						leftSection={<IconFolderOpen size={24} />}
						label="Enter Folder name"
						placeholder="test"
						value={folderName}
						onChange={(event) => setFolderName(event.currentTarget.value)}
					/>

					<input className="mt-4" type="file" multiple onChange={handleFileUpload} />

					{uploading && <div className="mt-4 text-yellow-800">Uploading, Please Wait</div>}

					{!uploading && arrImagesS3Links.length > 0 && (
						<div className="mt-4">
							<h3 className=" text-green-400">Uploaded Images Successfully</h3>
							<h3 className=" text-green-400">You can move to next step</h3>
						</div>
					)}
				</div>

				{/* <Notifications autoClose={4000} />; */}
			</Box>
		</>
	)
}

export default StepUploadToS3
