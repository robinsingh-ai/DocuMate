import fitz
from PIL import Image, ImageEnhance

def process_pdf(pdf_path, output_pdf_path, resolution=300, factor=1, contrast_factor=1):
    def pdf_to_images(pdf_path, resolution):
        pdf_document = fitz.open(pdf_path)
        mat = fitz.Matrix(resolution / 72.0, resolution / 72.0)
        images = []
        for page_number in range(pdf_document.page_count):
            page = pdf_document[page_number]
            image = page.get_pixmap(matrix=mat)
            images.append(image)
            print(f"\r正在读取第 {page_number + 1} 页 {round((page_number + 1) / pdf_document.page_count * 100, 2)}%", end='', flush=True)
        pdf_document.close()
        return images

    def adjust_images(images, factor, contrast_factor):
        def adjust_image(img, factor, contrast_factor):
            r, g, b = img.split()
            r = r.point(lambda i: i * factor)
            g = g.point(lambda i: i * factor)
            b = b.point(lambda i: i * factor)
            darkened_img = Image.merge('RGB', (r, g, b))
            enhancer = ImageEnhance.Contrast(darkened_img)
            contrasted_img = enhancer.enhance(contrast_factor)
            return contrasted_img
        
        processed_images = []
        for image in images:
            pil_image = Image.frombytes("RGB", [image.width, image.height], image.samples)
            processed_image = adjust_image(pil_image, factor, contrast_factor)
            processed_images.append(processed_image)
            print(f"\r正在处理第 {len(processed_images)} 页 {round(len(processed_images) / len(images) * 100, 2)}%", end='', flush=True)
        return processed_images

    images = pdf_to_images(pdf_path, resolution)
    processed_images = adjust_images(images, factor, contrast_factor)
    processed_images[0].save(output_pdf_path, save_all=True, append_images=processed_images[1:])
