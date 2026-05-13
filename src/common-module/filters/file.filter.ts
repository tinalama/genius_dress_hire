import { CustomHttpException } from '../exception/custom-http.exception';
import { StatusCodesList } from '../custom-constant/status-codes-list.constant';
import { HttpStatus } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|JPG|JPEG|PNG|heif|heic|HEIF|HEIC)$/
    )
  ) {
    return callback(
      new CustomHttpException(
        // `invalidImageFormat-{"format":"jpg,jpeg,png,webp,svg"}`,
        `invalidImageFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 15728640) {
    // 15MB
    return callback(
      new CustomHttpException(
        `fileTooLarge-{"size":15,"unit":"MB"}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};

export const smallImageFileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|JPG|JPEG|PNG|gif|GIF|webp|WEBP|svg|SVG)$/
    )
  ) {
    return callback(
      new CustomHttpException(
        `invalidImageFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 2000000) {
    // 2MB
    return callback(
      new CustomHttpException(
        `fileTooLarge-{"size":2}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};

export const excelFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xlsx|XLSX|xls|XLS)$/)) {
    return callback(
      new CustomHttpException(
        `invalidExcelFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 512000) {
    // 5MB
    return callback(
      new CustomHttpException(
        `fileTooLarge-{"size":500,"unit":"KB"}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};

export const csvFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv|CSV)$/)) {
    return callback(
      new CustomHttpException(
        `invalidCsvFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};

export const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|PDF)$/)) {
    return callback(
      new CustomHttpException(
        // `invalidImageFormat-{"format":"jpg,jpeg,png,webp,svg"}`,
        `invalidPdfFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 52428800) {
    // 50MB
    return callback(
      new CustomHttpException(
        `fileTooLarge-{"size":50,"unit":"MB"}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};

export const filesFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|JPG|JPEG|PNG|heif|heic|HEIF|HEIC|pdf|PDF|xlsx|XLSX|xls|XLS|doc|DOC|docx|DOCX)$/
    )
  ) {
    return callback(
      new CustomHttpException(
        // `invalidImageFormat-{"format":"jpg,jpeg,png,webp,svg"}`,
        `invalidImageFormat-{}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 15728640) {
    // 15MB
    return callback(
      new CustomHttpException(
        `fileTooLarge-{"size":15,"unit":"MB"}`,
        HttpStatus.CONFLICT,
        StatusCodesList.InternalServerError
      ),
      false
    );
  }
  callback(null, true);
};
