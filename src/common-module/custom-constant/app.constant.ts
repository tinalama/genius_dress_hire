export const DATA_SOURCE = 'DATA_SOURCE';

export const EMAIL_TEMPLATE_CODE = {
  PASSWORD_RESET_LINK: 'PasswordResetLinkEmail',
  FIRST_APPROVAL_REQUEST: 'FirstApprovalRequest',
  SECOND_APPROVAL_REQUEST: 'SecondApprovalRequest',
  EXPENSE_REJECT_EMAIL: 'ExpenseRejectEmail',
  EXPENSE_APPROVED_EMAIL: 'ExpenseApprovedEmail',
  NEW_EMPLOYEE_ONBOARDED_APPROVAL_REQUIRED:
    'NewEmployeeOnboardedApprovalRequired',
  EMPLOYEE_ONBOARDING_APPROVED: 'EmployeeOnboardingApproved',
  EMPLOYEE_ONBOARDING_REJECTED: 'EmployeeOnboardingRejected',
  EMPLOYEE_CHANGE_REQUEST: 'EmployeeChangeRequest',
  EVALUATION_PERIOD_EXPIRED: 'EvaluationPeriodExpired',
  EVALUATION_PERIOD_STARTED: 'EvaluationPeriodStarted',
  EMPLOYEE_ADDED_TO_EVALUATION_PERIOD: 'EmployeeAddedToEvaluationPeriod',
  EMPLOYEE_ADDED_TO_EVALUATION_PERIOD_REVIEWER:
    'EmployeeAddedToEvaluationPeriodReviewer',
  REVIEW_SUBMIT: 'ReviewSubmit',
  REVIEW_REMAINDER: 'ReviewReminder',
  PRESS_RELEASE_FIRST_APPROVAL_REQUEST: 'PressReleaseFirstApprovalRequest',
  PRESS_RELEASE_SECOND_APPROVAL_REQUEST: 'PressReleaseSecondApprovalRequest',
  DAILY_REPORT_REMINDER: 'DailyReportReminder',
  DAILY_IMPRESSION_REMINDER: 'DailyImpressionReminder'
};

export const event_status = {
  active: 'active',
  cancelled: 'cancelled'
};

export const EVENT_LOCATION_TYPE = {
  onsite: 'onsite',
  zoom: 'zoom',
  both: 'onsite/zoom'
};

export const EVENT_CONFIRMATION_STATUS = {
  yes: 'yes',
  no: 'no'
};

export const EVENT_NOTIFICATION_STATUS = {
  success: 'success',
  reject: 'reject',
  type_required: 'event_type_required'
};

export const EVENT_TYPE = {
  onsite: 'onsite',
  online: 'online'
};

export const JP_CONFIRMATION_STATUS = {
  pending: '保留中',
  accepted: '承認済み',
  rejected: '却下'
};

export const JP_ATTENDANCE_STATUS = {
  yes: '出席',
  no: '欠席'
};

/** OCR row link state to master product (ocr_product.link_status) */
export const OCR_PRODUCT_LINK_STATUS = {
  PROCESSING: 'processing',
  LINKED: 'linked',
  UNLINKED: 'unlinked',
  FAILED: 'failed'
} as const;

export const MASTER_PRODUCT_LINK_STATUS = {
  LINKED: 'linked',
  NOT_LINKED: 'not_linked'
} as const;

export type OcrProductLinkStatus =
  (typeof OCR_PRODUCT_LINK_STATUS)[keyof typeof OCR_PRODUCT_LINK_STATUS];

export const EXPENSE_TYPE = {
  travel: 'travel',
  company: 'company'
};

export const RECEIPT_TYPE = {
  paper: 'paper',
  electronic: 'electronic'
};

export const EXPENSE_STATUS = {
  draft: 'is_draft',
  pending: 'approval_pending',
  approved: 'approved',
  rejected: 'rejected',
  reapplied: 'reapplied'
};

export const EXPENSE_SUBMIT_STATUS = {
  draft: 'is_draft',
  pending: 'approval_pending'
};

export const EXPENSE_APPROVAL_STATUS = {
  pending: 'approval_pending',
  approved: 'approved',
  rejected: 'rejected'
};

export const APPROVAL_STATUS = {
  approved: 'approved',
  rejected: 'rejected'
};

export const TRAVEL_EXPENSE_TYPE = {
  general: 'general',
  transfer: 'transfer',
  office: 'office',
  meeting: 'meeting',
  training: 'training',
  other: 'other'
};

export const APPROVAL_LEVEL = {
  first: 'first-approval',
  second: 'second-approval'
};

export const INVOICE_TRANSFER_STATUS = {
  pending: 'pending',
  downloaded: 'downloaded'
};

export const EMPLOYEE_ACCESS_SETTING_TYPE = {
  EMPLOYEE_ADD: 'employee_add',
  EMPLOYEE_APPROVAL: 'employee_approval',
  EMPLOYEE_UPDATE_APPROVAL: 'employee_update_approval'
};

export const EMPLOYEE_APPROVAL_SETTING_TYPE = {
  EMPLOYEE_APPROVAL: 'employee_approval',
  EMPLOYEE_UPDATE_APPROVAL: 'employee_update_approval'
};

export const EMPLOYEE_ONBOARDING_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  REVISION_NEEDED: 'revision_needed',
  APPROVED: 'approved'
};

export const CONTRACT_TYPE = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time'
};

export const EMPLOYEE_ONBOARDING_FILE_TYPE = {
  RESUME: 'resume',
  YG_TEST_RESULT: 'yg-test-result'
};

export const EMPLOYEE_ONBOARDING_CONTRACT_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const EMPLOYEE_ONBOARDING_EXPORT_HEADER = {
  EMPLOYEE_NUMBER: '社員番号',
  LAST_NAME: '姓',
  FIRST_NAME: '名',
  HIRE_DATE: '入社年月日',
  CONTRACT_START_DATE: '契約開始日',
  CONTRACT_END_DATE: '契約終了日',
  CONTRACT_RENEWABLE: '契約更新の有無',
  DEPARTMENT: '部署名',
  EMPLOYMENT_TYPE: '雇用形態',
  PAY_TYPE: '給与支給形態',
  CONTRACT_JOB_DESCRIPTION: '契約条件.仕事内容',
  CONTRACT_JOB_DESCRIPTION_OTHER: '契約条件.仕事内容（その他）',
  SALARY_BASE: '賃金について（等級号俸）.基本給',
  SALARY_OTHER: '賃金について（等級号俸）.その他',
  SALARY_ALLOWANCE: '賃金について（等級号俸）.手当',
  SALARY_WEEKEND_HOLIDAY_ALLOWANCE_UNIT:
    '賃金について（等級号俸）.土日祝日手当（単価）',
  SALARY_LEADER_ALLOWANCE_UNIT: '賃金について（等級号俸）.リーダー手当（単価）',
  CONTRACT_START_TIME1_HOUR: '契約条件.始業時間①（時）',
  CONTRACT_START_TIME1_MINUTE: '契約条件.始業時間①（分）',
  CONTRACT_END_TIME1_HOUR: '契約条件.終業時間①（時）',
  CONTRACT_END_TIME1_MINUTE: '契約条件.終業時間①（分）',
  CONTRACT_BREAK_TIME1_MINUTE: '契約条件.休憩時間①（分）',
  CONTRACT_ACTUAL_WORK_TIME1_HOUR: '契約条件.実働時間①（時間）',
  CONTRACT_START_TIME2_HOUR: '契約条件.始業時間②（時）',
  CONTRACT_START_TIME2_MINUTE: '契約条件.始業時間②（分）',
  CONTRACT_END_TIME2_HOUR: '契約条件.終業時間②（時）',
  CONTRACT_END_TIME2_MINUTE: '契約条件.終業時間②（分）',
  CONTRACT_BREAK_TIME2_MINUTE: '契約条件.休憩時間②（分）',
  CONTRACT_ACTUAL_WORK_TIME2_HOUR: '契約条件.実働時間②（時間）',
  CONTRACT_WORK_DAYS_PER_WEEK: '契約条件.週労働日数',
  CONTRACT_WORK_HOURS_PER_WEEK: '契約条件.週労働時間',
  CONTRACT_HOLIDAY_DAY: '契約条件.休日（曜日）',
  CONTRACT_HOLIDAY_NUMBER: '契約条件.休日（日数）',
  CERTIFICATE_EMPLOYMENT_CERTIFICATE_REASON: '契約条件.所定時間外労働の有無',
  CERTIFICATE_EMPLOYMENT_CERTIFICATE_COMPANY_SEAL:
    '契約条件.所定時間外労働（時間）',
  CONTRACT_TYPE: '契約種別',
  TAX_CATEGORY: '課税区分',
  EMAIL: 'メールアドレス',
  OTHER_EMPLOYMENT_ROUTE: 'その他.就職経路',
  WORK_LOCATION: '就業場所.勤務地',
  WORK_LOCATION_ADDRESS: '就業場所.勤務地の住所',
  CONTRACT_MIDNIGHT_WORK_TIME: '契約条件.契約深夜時間',
  CONTRACT_ANNUAL_WORK_DAYS: '契約条件.年間所定労働日数',
  CONTRACT_HIGH_SCHOOL_OR_UNDER_18: '契約条件.高校生もしくは18歳未満',
  CONTRACT_RENEWAL_AVAILABILITY: '契約条件.契約の更新の有無'
};

export const EXPORT_FILE_NAME = {
  EMPLOYEE_ONBOARDING: '新入社員'
};

export const LANGUAGE_GROUP = {
  EMPLOYEE: 'employee',
  SUPPLIER: 'supplier',
  FRONTEND: 'frontend',
  KOSOKU: 'kosoku',
  AI_STUDIO: 'ai_studio'
};

export const EVALUATION_CRITERIA_TYPE = {
  evaluation: 'evaluation',
  score_based_evaluation: 'score_based_evaluation'
};

export const REVIEW_SUBMISSION_STATUS = {
  not_started: 'not_started',
  draft: 'draft',
  self_assessment_completed: 'self_assessment_completed',
  reviewer1_completed: 'reviewer1_completed',
  reviewer2_completed: 'reviewer2_completed',
  reviewer3_completed: 'reviewer3_completed',
  review_completed: 'review_completed'
};

export const REVIEW_SUBMISSION_WORKFLOW_ORDER: readonly string[] =
  Object.values(REVIEW_SUBMISSION_STATUS);

export const EMPLOYEE_REVIEW_STATUS = {
  not_started: 'not_started',
  draft: 'draft',
  completed: 'completed'
};

export const EVALUATION_PERIOD_EMPLOYEE_REVIEW_STATUS = {
  not_started: 'not_started',
  draft: 'draft',
  completed: 'self_assessment_completed',
  reviewer1_completed: 'reviewer1_completed',
  reviewer2_completed: 'reviewer2_completed',
  reviewer3_completed: 'reviewer3_completed',
  review_completed: 'review_completed'
};

export const SCORE_BASED_EVALUATION_VALUES = ['1', '2', '3', '4'];
export const EVALUATION_VALUES = ['good', 'better'];

export const UPLOAD_FILE_TYPE = {
  PRODUCT_REGISTRATION: 'product-registration'
};

export const EVALUATION_PERIOD_COMPLETION_STATUS = {
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete'
};

export const ONBOARDING_FILE_TYPE = {
  RESUME: 'resume',
  YG_TEST_RESULT: 'yg_test_result'
};

export const PRESS_RELEASE_TONE = {
  HAPPY_AND_EXCITED: 'Happy and Excited'
};

export const REVIEW_MODULE_TYPE = {
  evaluation_period: 'evaluation_period',
  evaluation_status: 'evaluation_status',
  evaluate_employee: 'evaluate_employee'
};

export const PRODUCT_HYGIENE_CHECKLIST_CATEGORIES = {
  hyg_1: 'personal_hygiene_management',
  hyg_2: 'hand_washing_and_disinfection',
  hyg_3: 'raw_material_acceptance_and_washing_disinfection',
  hyg_4: 'temperature_and_time_management',
  hyg_5: 'management_of_areas_where_food_is_exposed',
  hyg_6:
    'cleaning_and_disinfection_of_utensils_and_equipment_in_direct_contact_with_food',
  hyg_7: 'water_hygiene_management_using_well_water_or_storage_tanks',
  hyg_8: 'other_inspections'
};

export const PRODUCT_EVALUATION_CATEGORIES = {
  eval_1: 'factory_entrance_work',
  eval_2: 'organize_and_cleaning',
  eval_3:
    'manufacturing_plant_and_warehouse_partition_between_the_warehouse_and_the_outside',
  eval_4: 'cleanliness_distinguishing_the_dyeing_zone',
  eval_5: 'intake_and_exhaust',
  eval_6: 'ease_of_cleaning',
  eval_7: 'drying_the_floor',
  eval_8: 'illuminance',
  eval_9: 'machinery_and_equipment_different',
  eval_10: 'worker_guard',
  eval_11: 'equipment',
  eval_12: 'cleaning_and_sterilization',
  eval_13: 'insect_and_rodent_protection',
  eval_14: 'damaged_items_and_confusion',
  eval_15: 'inspections_etc',
  eval_16: 'others_attachments_etc'
};

export const OCR_PDF_FILE_KEYS = [
  'basic_hygiene_checklist_file_key',
  'inspection_file_key',
  'product_specification_file_key',
  'miscellaneous_file_key',
  'certification_file_key'
] as const;

export type OcrPdfFileKey = (typeof OCR_PDF_FILE_KEYS)[number];

// Document type filter values for filtering by document availability
export enum DocumentTypeFilter {
  PRODUCT_SPECIFICATION = 'product_specification',
  BASIC_HYGIENE_CHECKLIST = 'basic_hygiene_checklist',
  INSPECTION = 'inspection',
  CERTIFICATION = 'certification',
  MISCELLANEOUS = 'miscellaneous'
}

/**
 * Maps document type filter values to corresponding file_key columns
 * in the ocr_product table for NULL-check based filtering.
 */
export const DOCUMENT_TYPE_TO_FILE_KEY: Record<DocumentTypeFilter, string> = {
  [DocumentTypeFilter.PRODUCT_SPECIFICATION]: 'product_specification_file_key',
  [DocumentTypeFilter.BASIC_HYGIENE_CHECKLIST]:
    'basic_hygiene_checklist_file_key',
  [DocumentTypeFilter.INSPECTION]: 'inspection_file_key',
  [DocumentTypeFilter.CERTIFICATION]: 'certification_file_key',
  [DocumentTypeFilter.MISCELLANEOUS]: 'miscellaneous_file_key'
};

/**
 * Section image limits per section type (max images allowed per section)
 */
export const OCR_PRODUCT_SECTION_IMAGE_LIMITS: Record<string, number> = {
  basic_hygiene_checklist: 5,
  product_specification: 5,
  inspection: 5,
  miscellaneous: 15,
  certification: 5
};

/**
 * Section image folder names per section type (S3 folder path)
 */
export const OCR_PRODUCT_SECTION_IMAGE_FOLDERS: Record<string, string> = {
  basic_hygiene_checklist: 'basic-hygiene-checklist-images',
  product_specification: 'product-specification-images',
  inspection: 'inspection-images',
  miscellaneous: 'miscellaneous-images',
  certification: 'certification-images'
};

/**
 * Section image filename prefixes per section type
 */
export const OCR_PRODUCT_SECTION_IMAGE_PREFIXES: Record<string, string> = {
  basic_hygiene_checklist: 'basic_hygiene_checklist',
  product_specification: 'product_specification',
  inspection: 'inspection',
  miscellaneous: 'miscellaneous',
  certification: 'certification'
};

export const SMARTHR_WEBHOOK_EVENT_TYPE = {
  CREW_CREATED: 'crew_created',
  CREW_UPDATED: 'crew_updated',
  CREW_DELETED: 'crew_deleted',
  CREW_IMPORTED: 'crew_imported',
  DEPENDENT_CREATED: 'dependent_created',
  DEPENDENT_UPDATED: 'dependent_updated',
  DEPENDENT_DELETED: 'dependent_deleted',
  DEPENDENT_IMPORTED: 'dependent_imported',
  WORKFLOW_APPROVED: 'workflow_approved'
};

export const SMARTHR_WEBHOOK_EVENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped'
};
