export const MessageEnum = {
  DATA_FETCHED_SUCCESSFULLY: 'Data fetched successfully',
  MODULE_CREATED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} created successfully`,
  MODULE_FETCHED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} fetched successfully`,
  MODULE_UPDATED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} updated successfully`,
  MODULE_SAVED_AS_DRAFT_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} saved as draft successfully`,
  MODUELE_ORDER_SPLITED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} split successfully`,
  MODULE_DELETED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} deleted successfully`,
  MODULE_NOT_FOUND: (moduleName: string) => `${moduleName} not found`,
  ALREADY_EXISTS: (moduleName: string) =>
    `The ${moduleName} has already been taken`,
  INVALID_REQUEST_DATA: 'Invalid Request Data',
  SYNC_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} synced successfully`,
  UPLOAD_TRANSLATION: 'File uploaded successfully',
  DOWNLOAD_TRANSLATION: 'File downloaded successfully',
  STATUS_COUNT_FETCHED_SUCCESSFULLY: 'Order status count fetched successfully',
  SET_SUPPLIER_USER_PASSWORD: 'Supplier user password set successfully',
  BULK_SET_SUPPLIER_USER_PASSWORD: 'Bulk supplier user passwords generated',
  PRESS_RELEASE_APPROVED_SUCCESSFULLY: 'Press release approved successfully',
  PRESS_RELEASE_SENT_FOR_RELEASE_SUCCESSFULLY:
    'Press release sent for release successfully',
  PRESS_RELEASE_RELEASED_SUCCESSFULLY: 'Press release released successfully'
};

export const EVENT_EMIT_NAME = {
  EVENT_INVITATION_EMAIL: 'event.invitation.email',
  PROCESS_EVENT_INVITATION_EMAIL: 'process.event.invitation.emails',
  SEND_MAIL: 'send.mail',
  EXPENSE_APPROVAL_EMAIL: 'expense.approval.email',
  EMPLOYEE_ONBOARDING_EMAIL: 'employee.onboarding.email',
  ORDERER_ORDER_PLACEMENT_EMAIL: 'orderer.order.placement.email',
  EVALUATION_PERIOD_STARTED: 'evaluation.period.started'
};

export const EVENT_INVITATION_TYPE = {
  department: 'department',
  employee: 'employee'
};

export const EVENT_SUCCESS_MESSAGE = {
  EVENT_CREATED_SUCCESSFULLY: 'EventCreatedSuccessfully',
  EVENT_UPDATED_SUCCESSFULLY: 'EventUpdatedSuccessfully',
  DATA_FETCHED_SUCCESSFULLY: 'DataFetchedSuccessfully',
  EVENT_FETCHED_SUCCESSFULLY: 'EventFetchedSuccessfully',
  EVENT_PARTICIPANT_DELETED_SUCCESSFULLY: 'EventParticipantDeleted',
  EVENT_PARTICIPANT_ADDED_SUCCESSFULLY: 'EventParticipantAdded',
  EVENT_CANCELLED_SUCCESSFULLY: 'EventCancelledSuccessfully',
  EVENT_PARTICIPANT_FETCHED_SUCCESSFULLY: 'EventParticipantFetched',
  REINVITE_PARTICIPANT_SUCCESSFULLY: 'ReinviteParticipantSuccessfully',
  NOTIFICATION_FETCHED_SUCCESSFULLY: 'NotificationFetchedSuccessfully',
  EVENT_TYPE_REQUIRED: 'EventTypeRequired',
  EVENT_ACCEPTED_SUCCESSFULLY: 'EventAcceptedSuccessfully',
  EVENT_REJECTED: 'EventRejected',
  QR_CODE_ALREADY_SCANNED: 'QRCodeAlreadyScanned',
  ATTENDANCE_SUCCESSFUL: 'AttendanceSuccessful',
  RESEND_QR_CODE_SUCCESSFULLY: 'ResendQrCodeSuccessfully',
  ALREADY_RESPONDED: 'AlreadyResponded',
  MANUAL_CHECK_IN_SUCCESSFULLY: 'ManualCheckInSuccessfully',
  ORDER_PLACEMENT_EMAIL: 'OrderPlacedEmail'
};

export const SUCCESS_MESSAGE = {
  DOWNLOAD_TRANSLATION: 'DownloadTranslationSuccessfully',
  EXPENSE_APPROVAL_CONFIG_CREATED_SUCCESSFULLY:
    'ExpenseApprovalConfigCreatedSuccessfully',
  DATA_FETCHED_SUCCESSFULLY: 'Data Fetched Successfully',
  MODULE_UPDATED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} Updated Successfully`,
  MODULE_DELETED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} Deleted Successfully`,
  MODULE_CREATED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} Created Successfully`,
  NO_APPROVAL_CONFIG_FOUND:
    'No approval configuration found, Your expense has been submitted',
  APPROVAL_SUCCESSFULLY: 'Expense approved successfully',
  REJECTED_SUCCESSFULLY: 'Expense rejected successfully',
  EXPENSE_SUBMITTED_SUCCESSFULLY: 'Expense submitted successfully',
  MODULE_DRAFT_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} saved as Draft successfully`,
  MODULE_SYNCED_SUCCESSFULLY: (moduleName: string) =>
    `${moduleName} synced successfully`,
  DATA_EXPORT_SUCCESSFULLY: 'Data Exported Successfully',
  DATA_UPLOADED_SUCCESSFULLY: 'Data Uploaded Successfully',
  PASSWORD_RESET_LINK_SENT: 'We have sent a password reset link to your email',
  PASSWORD_RESET_LINK_SENT_TO_EMAIL:
    'If the email exists, a reset link will be sent to the email',
  ORDER_PLACEMENT_EMAIL: 'OrderPlacedEmail',
  SELF_REVIEW_SAVED_SUCCESSFULLY: 'Self-review saved successfully',
  REVIEW_SAVED_SUCCESSFULLY: 'Review saved successfully',
  ADDED_EMPLOYEES_TO_EVALUATION_PERIOD:
    'Employees added to evaluation period successfully',
  EXTENDED_EVALUATION_PERIOD: 'Evaluation period extended successfully',
  UPDATED_EMPLOYEE_EMAIL: 'Employee email updated successfully'
};

export const ERROR_MESSAGE = {
  EXPENSE_NOT_FOUND: 'ExpenseNotFound',
  EXPENSE_IS_DRAFT: 'ExpenseIsDraft',
  ALREADY_APPROVED: 'AlreadyApproved',
  ALREADY_REJECTED: 'AlreadyRejected',
  NOT_ALLOWED_TO_APPROVE: 'NotAllowedToApprove',
  FIRST_LEVEL_NOT_APPROVED: 'FirstLevelNotApproved',
  NOT_ALLOWED_TO_REJECT: 'NotAllowedToReject',
  ALREADY_APPROVED_OR_REJECTED: 'AlreadyApprovedOrRejected',
  INVALID_TOKEN: 'InvalidToken',
  CANNOT_REAPPLY: 'CannotReapplyExpense',
  ALREADY_REAPPLY: 'AlreadyReapply',
  INVALID_EXPENSE_FOR_REAPPLY: 'InvalidExpenseForReapply',
  CANNOT_UPDATE_OTHER_EXPENSE: 'CannotUpdateOtherExpense',
  CANNOT_VIEW_OTHER_EXPENSE: 'CannotViewOtherExpense',
  MODULE_NOT_FOUND: (moduleName: string) => `${moduleName} not found`,
  MODULE_ALREADY_EXISTS: (moduleName: string) => `${moduleName} already exists`,
  CANNOT_CHANGE_CONTRACT_CODE: 'Cannot change contract code',
  INVALID_MODULE: (moduleName: string) => `Invalid ${moduleName}`,
  SAME_PARENT_CATEGORY_TITLE: 'Same as parent category title',
  CANNOT_MODIFY_MODULE: (moduleName: string) => `${moduleName}`,
  MUST_BE_UNIQUE: (field: string) => `${field} must be unique`,
  MUST_BE_EQUAL: (field1: string, field2: string) =>
    `${field1} must be equal to ${field2}`,
  SHIFT1_BREAK_TIME: 'There are not enough breaks in working time (1)',
  SHIFT2_BREAK_TIME: 'There are not enough breaks in working time (2)',
  contract_overtime_work_hours:
    'Prescribed overtime is available, but no hours have been entered',
  no_contract_overtime_work_hours:
    'No prescribed overtime is entered, so please leave the hours field blank',
  working_hours_exceed_40_hours: 'Your weekly working hours exceed 40 hours',
  working_days_exceed_5_days: 'The number of working days per week exceeds 5',
  contract_end_date: 'The contract end date is backdated',
  minimum_wage: 'Your hourly wage is below the minimum wage',
  ORDER_UPDATE_NOT_ALLOWED: 'You are not allowed to update this order',
  ORDER_DRAFT_STATUS_CHANGE_NOT_ALLOWED:
    'Cannot change order back to draft status once it has been processed',
  ORDER_APPROVED_CANCEL_NOT_ALLOWED: 'Cannot cancel an approved order',
  ORDER_CANCEL_NOT_ALLOWED_FOR_THIS_STATUS: 'Cannot cancel for this order',
  NOT_ALLOWED: 'You are not allowed to view',
  ORDER_STATUS_CHANGE_NOT_ALLOWED: 'Cannot change status to ordered',
  NO_PERMISSION: 'You do not have permission to perform this action',
  PRODUCT_NOT_FOUND: 'Please select any one product',
  PRODUCT_CODE_ALREADY_EXISTS: 'Product code already exists',
  SUPPLIER_NOT_FOUND: 'Supplier not found',
  ONLY_PRODUCTS_WITH_STATUS_PENDING_OR_REJECTED_CAN_BE_UPDATED:
    'Only products with status PENDING or REJECTED can be updated',
  REGISTER_PRODUCT_CODE_ALREADY_EXISTS:
    'Product with this code is already registered',
  EMPLOYEE_NOT_BELONG_TO_DEPARTMENT:
    'Some employees do not belong to selected departments',
  DUPLICATE_DEPARTMENTS: 'Duplicate departments',
  DUPLICATE_EMPLOYEES_FOR_SAME_DEPARTMENT:
    'Duplicate employees for same department',
  ONE_OR_MORE_SELECTED_DEPARTMENTS_NOT_FOUND:
    'One or more selected departments not found',
  EMPLOYEE_INACTIVE_OR_INVALID: 'Some employees are inactive or invalid',
  NO_VALID_EMPLOYEES_FOR_COMPANY: 'Invalid employees for selected company',
  YEAR_ASSOCIATED_WITH_DREAMS_AND_GOALS:
    'Year is associated with dreams and goals',
  FIRST_LEVEL_APPROVER_CANNOT_BE_DELETED:
    'First level approver cannot be deleted',
  MODULE_ALREADY_APPROVED: (moduleName: string) =>
    `${moduleName} has already been approved`,
  PRESS_RELEASE_CAN_NOT_BE_RELEASED:
    'Press release can not be released in currect status',
  SECOND_LEVEL_APPROVER_CANNOT_BE_DELETED:
    'Unable to delete since press releases are waiting for 2nd approval or pending release',
  OCR_FILE_NOT_COMPLETED: 'OCR file processing is not completed',
  OCR_FILE_NOT_FOUND: 'Unable to download the uploaded file',
  NO_IMAGE_CONTENT_FOUND: 'No image content found for this OCR product',
  OCR_IMAGE_NOT_FOUND: 'Image not found with the provided s3Key',
  OCR_IMAGE_ALREADY_DELETED: 'Image is already deleted',
  OCR_IMAGE_NOT_FOUND_OR_DELETED: 'Image not found or has been deleted'
};

/** Messages for employee company / department history API */
export const EMPLOYEE_COMPANY_HISTORY_MESSAGE = {
  EMPLOYEE_NOT_FOUND: 'Employee with the specified ID was not found',
  EMPLOYEE_COMPANY_HISTORY_FETCHED_SUCCESSFULL:
    'Employee company history fetched successfully',
  EMPLOYEE_COMPANY_HISTORY_ADDED_SUCCESSFULLY:
    'Employee company history added successfully',
  VALIDATION_FAILED: 'Validation failed',
  HISTORY_ENTRY_NOT_FOUND: (historyId: string) =>
    `History entry with _id ${historyId} not found`,
  HISTORY_ENTRY_WRONG_EMPLOYEE: (historyId: string) =>
    `History entry with _id ${historyId} does not belong to this employee`,
  COMPANY_NOT_FOUND: (uuid: string) => `Company with ID ${uuid} does not exist`,
  DEPARTMENT_NOT_FOUND: (uuid: string) =>
    `Department with ID ${uuid} does not exist`,
  START_DATE_AFTER_END_DATE: 'Start date cannot be a greater than end_date',
  END_DATE_BEFORE_START_DATE: 'End date cannot be a smaller than start_date',
  DEPARTMENT_NOT_IN_COMPANY: (entryNumber: number) =>
    `Department does not belong to the selected company (entry ${entryNumber})`
};

/** Messages for employee user level API */
export const EMPLOYEE_USER_LEVEL_MESSAGE = {
  EMPLOYEE_USER_LEVEL_SAVED_SUCCESSFULLY:
    'Employee user level saved successfully',
  EMPLOYEE_USER_LEVEL_FETCHED_SUCCESSFULLY:
    'Employee user level fetched successfully'
};

export const DAILY_REPORT_ERROR_MESSAGE = {
  NO_MANAGER_SELECTED_FOR_SUBMISSION:
    'At least one manager must be selected for submission',
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  REPORT_DATE_CANNOT_BE_FUTURE_DATE: 'Report date cannot be a future date',
  REPORT_DATE_CANNOT_BE_CHANGED:
    'Report date cannot be changed, it must match the existing report date',
  DUPLICATE_MANAGER_IDS_NOT_ALLOWED: 'Duplicate manager IDs are not allowed',
  MANAGER_IDS_NOT_FOUND: (invalidIds: string[]) =>
    `The following manager IDs do not exist in the system: ${invalidIds.join(', ')}`,
  ALL_QUESTIONS_MUST_BE_ANSWERED: (unansweredQuestions: string[]) =>
    `All questions must be answered before submitting the daily report, missing answers for: ${unansweredQuestions.join(
      ', '
    )}`,
  SUBMITTED_DAILY_REPORT_ALREADY_EXISTS:
    'A submitted daily report already exists for this date',
  DAILY_REPORT_ALREADY_EXISTS: 'A daily report exists for this date',
  DAILY_REPORT_NOT_FOUND: 'Daily report not found or does not belong to you',
  CALENDAR_FROM_DATE_AND_TO_DATE_REQUIRED:
    'from_date and to_date are required for the calendar view (YYYY-MM-DD)',
  ONLY_DRAFT_REPORTS_CAN_BE_UPDATED: 'Only draft reports can be updated',
  ONLY_DRAFT_REPORTS_CAN_BE_DELETED: 'Only draft reports can be deleted',
  SUBMITTED_REPORT_CANNOT_REVERT_TO_DRAFT:
    'Submitted daily reports cannot be reverted to draft on resubmission',
  FILE_REQUIRED: 'File is required',
  INVALID_FILE_TYPE:
    'Invalid file type, only image (jpg, jpeg, png, gif, bmp), PDF, and Excel (xls, xlsx) files are allowed',
  FILE_SIZE_EXCEEDS_LIMIT:
    'One or more files exceed the maximum limit of 10 MB, please upload smaller files',
  Q2_MAX_FILES_EXCEEDED:
    'You can only upload one file for Question 2, please remove the existing file to upload a new one',
  Q6_MAX_FILES_EXCEEDED:
    'You can only upload up to two files for Question 6, please remove an existing file to upload a new one',
  INVALID_QUESTION_KEY:
    'question_key must be question_2_attachments or question_6_attachments',
  ATTACHMENT_NOT_FOUND: 'Attachment not found',
  /** S3 rejected credentials (e.g. InvalidAccessKeyId) while promoting temp → permanent */
  ATTACHMENT_STORAGE_CREDENTIALS_INVALID:
    'File storage could not complete this operation, AWS S3 credentials for this server are invalid or do not match the bucket account, please update AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY or s3.awsAccessKeyId / s3.awsSecretAccessKey in configuration',
  INVALID_FILE_TYPE_QUERY:
    'file_type must be question_2_attachments or question_6_attachments',
  NOT_AUTHORIZED_TO_VIEW_ATTACHMENTS:
    'You do not have permission to view attachments for this daily report',
  TEMP_FILE_LIMIT_EXCEEDED: (
    uploadCount: number,
    existingCount: number,
    questionKey: string,
    maxFiles: number,
    availableSlots: number
  ) =>
    `Cannot upload ${uploadCount} file(s). You already have ${existingCount} temp file(s) for ${questionKey}. Maximum allowed is ${maxFiles}. You can upload ${availableSlots} more file(s).`,
  REPORT_NOT_FOUND_OR_YOU_DO_NOT_HAVE_ACCESS_TO_THIS_REPORT:
    'Report not found or you do not have access to this report'
};

export const DAILY_IMPRESSION_ERROR_MESSAGE = {
  IMPRESSION_DATE_CANNOT_BE_FUTURE_DATE:
    'Impression date cannot be a future date',
  IMPRESSION_DATE_CANNOT_BE_CHANGED:
    'Impression date cannot be changed, it must match the existing impression date',

  QUESTION_MUST_BE_ANSWERED: (unansweredQuestions: string[]) =>
    `Question must be answered before submitting the daily impression, missing answers for: ${unansweredQuestions.join(
      ', '
    )}`,
  SUBMITTED_DAILY_IMPRESSION_ALREADY_EXISTS:
    'A submitted daily impression already exists for this date',
  DAILY_IMPRESSION_ALREADY_EXISTS:
    'A daily impression already exists for this date',
  DAILY_IMPRESSION_NOT_FOUND:
    'Daily impression not found or does not belong to you',
  ONLY_DRAFT_IMPRESSIONS_CAN_BE_UPDATED:
    'Only draft impressions can be updated',
  ONLY_DRAFT_IMPRESSIONS_CAN_BE_DELETED:
    'Only draft impressions can be deleted',
  IMPRESSION_NOT_FOUND_OR_YOU_DO_NOT_HAVE_ACCESS_TO_THIS_IMPRESSION:
    'Impression not found or you do not have access to this impression'
};

export const DAILY_REPORT_SUCCESS_MESSAGE = {
  DAILY_REPORT_CREATED_SUCCESSFULLY: 'Daily report created successfully'
};

export const DAILY_IMPRESSION_SUCCESS_MESSAGE = {
  DAILY_IMPRESSION_CREATED_SUCCESSFULLY: 'Daily impression created successfully'
};

export const REVIEW_MANAGEMENT_ERROR_MESSAGE = {
  GENRE_ALREADY_EXISTS: 'Genre with this template category already exists',
  JOB_ALREADY_EXISTS: 'Job with this template category already exists',
  EVALUATION_CRITERIA_ALREADY_EXISTS:
    'Evaluation criteria with this template category already exists',
  ITEM_ALREADY_EXISTS: 'Item with this template category already exists',
  EVALUATION_PERIOD_ALREADY_EXISTS:
    'Evaluation period with this template category already exists',
  INVALID_YEAR_ID: 'Invalid year id or year not found from year management',
  YEAR_MUST_BE_ACTIVE: 'Only active years can be used for an evaluation period',
  TAG_ALREADY_EXISTS: 'Tag with this template category already exists',
  REVIEW_TEMPLATE_NOT_FOUND: 'Review template not found',
  REVIEWERS_MUST_BE_UNIQUE: 'Reviewers must be unique',
  EVALUATION_PERIOD_NOT_FOUND: 'Evaluation period not found',
  DEPARTMENTS_MUST_BE_UNIQUE:
    'Departments must be unique, Please remove duplicate department selections',
  EMPLOYEES_CANNOT_BE_REVIEWERS:
    'An employee cannot be set as their reviewer, Please select a different reviewer manager',
  INVALID_REVIEWERS: 'Invalid or inactive reviewers',
  REVIEW_TEMPLATE_NAME_ALREADY_EXISTS:
    'Review template with this name already exists',
  MODULE_NOT_FOUND: (moduleName: string) => `${moduleName} not found`,
  ACCESS_DENIED: 'Access denied',
  MUST_BE_FUTURE_DATE: 'Start Date must be a future date',
  DUPLICATE_JOBS: 'Duplicate jobs are not allowed',
  REVIEW_TEMPLATE_USED:
    'Review template is linked in an evaluation period which has started or completed',
  JOB_USED: 'Job is used in a review template, cannot be deleted',
  ITEM_USED: 'Item is used in a review template, cannot be deleted',
  REVIEW_ALREADY_COMPLETED: 'Review has already been completed',
  INVALID_REVIEW_PROVIDED: 'Invalid review provided',
  REVIEW_REQUIRED: 'All reviews are required',
  REVIEW_ITEMS_MISSING: 'Review items are missing',
  EVALUATION_PERIOD_IN_PROGRESS:
    'Evaluation period is in progress, review has been started',
  INVALID_REVIEWER: 'Invalid reviewer',
  EMPLOYEE_REVIEW_NOT_STARTED: 'Employee has not started review yet',
  EVALUATION_PERIOD_HAS_ENDED: 'Evaluation period has ended',
  EVALUATION_PERIOD_HAS_NOT_STARTED: 'Evaluation period has not started',
  EVALUATION_NOT_SUBMITTED: 'Evaluation not submitted',
  CANNOT_SUBMIT_BEFORE_OTHER_REVIEWER:
    'Cannot submit review before other reviewer has completed their review',
  EMPLOYEE_REVIEW_NOT_COMPLETED: 'Employee review has not been completed',
  INVALID_ITEM_REVIEW: 'Invalid item review',
  INVALID_TEMPLATE_ITEM: 'Invalid template item linked in review',
  EVALUATION_PERIOD_EXPIRED: (action: string) =>
    `Employee cannot be ${action} as the evaluation period has been expired`,
  EVALUATION_PERIOD_COMPLETED_OR_EXPIRED: (action: string) =>
    `Employee cannot be ${action} as the evaluation period has been completed or expired`,
  ACCESS_DENIED_TO_ADD_EMPLOYEES:
    'You do not have permission to add employees to this evaluation period',
  REVIEWER_CANNOT_BE_ADDED_AS_EMPLOYEE: 'Reviewer cannot be added as employee',
  NO_VALID_EMPLOYEES_FOR_DEPARTMENT:
    'Invalid employees for selected department',
  CANNOT_EXTEND_EVALUATION_PERIOD_NOT_EXPIRED:
    'Cannot extend evaluation period - not expired',
  CANNOT_EXTEND_EVALUATION_PERIOD_ALREADY_COMPLETED:
    'Cannot extend evaluation period - already completed',
  NEW_DUE_DATE_MUST_BE_AFTER_CURRENT_END_DATE:
    'New due date must be after the current end date',
  TEMPLATE_CATEGORY_MUST_BE_THE_SAME: (moduleName: string) =>
    `${moduleName} template category must be the same`,
  GENRE_NOT_FOUND_FOR_SELECTED_TEMPLATE_CATEGORY:
    'Genre not found for selected template category',
  REVIEWER_COMMENT_REQUIRED: 'Reviewer comment is required',
  EVALUATION_CRITERIA_NOT_FOUND: 'Evaluation criteria not found',
  EVALUATION_CRITERIA_LIMIT_EXCEEDED:
    'A maximum of 3 evaluation criteria are allowed for the selected template category',
  EVALUATION_CRITERIA_CATEGORY_CHANGE_NOT_ALLOWED:
    'Evaluation criteria template category cannot be changed, it is linked to items',
  EVALUATION_CRITERIA_DELETE_NOT_ALLOWED:
    'Cannot delete evaluation criteria, It is linked to items',
  REVIEWER_NO_PERMISSION:
    'You do not have permission to view this evaluation period reviews',
  INVALID_MODULE_TYPE: 'Invalid module type provided',
  CANNOT_SAVE_AS_DRAFT_WHEN_COMPLETED:
    'Cannot save as draft when review is already completed',

  // Excel Export Messages
  EXCEL_EXPORT_SUCCESSFULLY: 'excelExportSuccessfully',
  EVALUATION_EXPORT_SUCCESSFULLY: 'evaluationExportSuccessfully',
  NO_EVALUATION_DATA_AVAILABLE: 'noEvaluationDataAvailable',
  EXPORT_GENERATION_FAILED: 'exportGenerationFailed'
};
