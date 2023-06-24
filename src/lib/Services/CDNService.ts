import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} from '$env/static/private';

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

const cc = cloudinary;

export async function UploadToCDN(file: any, fileName: string) {
	return new Promise((resolve, reject) => {
		cc.uploader
			.upload_stream({ resource_type: 'image', public_id: fileName }, UploadComplete)
			.end(file);

		function UploadComplete(error: any, result: any) {
			if (error) {
				return reject({ success: false, error });
			}
			return resolve({ success: true, result });
		}
	});
}
