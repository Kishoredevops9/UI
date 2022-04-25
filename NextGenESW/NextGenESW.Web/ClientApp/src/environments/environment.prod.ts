//import * as data from "../assets/data/settings.json";
var data = require('../assets/data/settings.json');

export const environment = {
  production: true,
  clientId:
    window['__env'] && window['__env'].clientId
      ? window['__env'].clientId
      : data.clientId,
  authority:
    window['__env'] && window['__env'].authority
      ? window['__env'].authority
      : data.authority,
  apiUrl:
    window['__env'] && window['__env'].apiUrl
      ? window['__env'].apiUrl
      : data.apiUrl,
  hclenv:
    window['__env'] && window['__env'].hclenv
      ? window['__env'].hclenv
      : data.hclenv,
  XClassLaunchURL:
      window['__env'] && window['__env'].XClassLaunchURL
        ? window['__env'].XClassLaunchURL
        : data.XClassLaunchURL,
  processMapAPI:
    window['__env'] && window['__env'].processMapAPI
      ? window['__env'].processMapAPI
      : data.processMapAPI,
  siteAdminAPI:
    window['__env'] && window['__env'].siteAdminAPI
      ? window['__env'].siteAdminAPI
      : data.siteAdminAPI,
  authSuccessUrlRedirect:
    window['__env'] && window['__env'].authSuccessUrlRedirectProd
      ? window['__env'].authSuccessUrlRedirectProd
      : data.authSuccessUrlRedirectProd,
  taskAPI:
    window['__env'] && window['__env'].taskAPI
      ? window['__env'].taskAPI
      : data.taskAPI,
  siteSecurityAPI:
    window['__env'] && window['__env'].siteSecurityAPI
      ? window['__env'].siteSecurityAPI
      : data.siteSecurityAPI,
  dashboardContentFlag:
    window['__env'] && window['__env'].dashboardContentFlag
      ? window['__env'].dashboardContentFlag
      : data.dashboardContentFlag,
  EKSInternalSearchAPI:
    window['__env'] && window['__env'].EKSInternalSearchAPI
      ? window['__env'].EKSInternalSearchAPI
      : '',
  EKSInternalSearchAPI2:
      window['__env'] && window['__env'].EKSInternalSearchAPI2
        ? window['__env'].EKSInternalSearchAPI2
        : '',
  EKSGlobalSearchExternalAPI:
    window['__env'] && window['__env'].EKSGlobalSearchExternalAPI
      ? window['__env'].EKSGlobalSearchExternalAPI
      : '',
  eksGroup:
    window['__env'] && window['__env'].eksGroup
      ? window['__env'].eksGroup
      : data.eksGroup,
  EKSGlobalSearchExternalAPIStartAtValue:
    window['__env'] && window['__env'].EKSGlobalSearchExternalAPIStartAtValue
      ? window['__env'].EKSGlobalSearchExternalAPIStartAtValue
      : '',
  EKSGlobalSearchExternalAPIMaxItemsValue:
    window['__env'] && window['__env'].EKSGlobalSearchExternalAPIMaxItemsValue
      ? window['__env'].EKSGlobalSearchExternalAPIMaxItemsValue
      : '',
  EKSGloablSearchExternalAPIEndPoint:
    window['__env'] && window['__env'].EKSGloablSearchExternalAPIEndPoint
      ? window['__env'].EKSGloablSearchExternalAPIEndPoint
      : '',
  eksContentManagementGroup:
    window['__env'] && window['__env'].eksContentManagementGroup
      ? window['__env'].eksContentManagementGroup
      : '',
  eksAdminGroup:
    window['__env'] && window['__env'].eksAdminGroup
      ? window['__env'].eksAdminGroup
      : '',
  isPWContractor:
    window['__env'] && window['__env'].isPWContractor
      ? window['__env'].isPWContractor
      : '',
  pwEKSContentMgmtCAContrator:
    window['__env'] && window['__env'].pwEKSContentMgmtCAContrator
      ? window['__env'].pwEKSContentMgmtCAContrator
      : '',
  pwEKSContentMgmtFNContrator:
    window['__env'] && window['__env'].pwEKSContentMgmtFNContrator
      ? window['__env'].pwEKSContentMgmtFNContrator
      : '',
  pwEKSContentMgmtUSContrator:
    window['__env'] && window['__env'].pwEKSContentMgmtUSContrator
      ? window['__env'].pwEKSContentMgmtUSContrator
      : '',
  EKSPWPlayExternalAPI:
    window['__env'] && window['__env'].EKSPWPlayExternalAPI
      ? window['__env'].EKSPWPlayExternalAPI
      : '',
  EKSPWPlayExternalAPIEndpoint:
    window['__env'] && window['__env'].EKSPWPlayExternalAPIEndpoint
      ? window['__env'].EKSPWPlayExternalAPIEndpoint
      : '',
  EKSGloablSearchExternalAPIFields:
    window['__env'] && window['__env'].EKSGloablSearchExternalAPIFields
      ? window['__env'].EKSGloablSearchExternalAPIFields
      : '',
  EKSGlobalSearchPaginationFlag:
    window['__env'] && window['__env'].EKSGlobalSearchPaginationFlag
      ? window['__env'].EKSGlobalSearchPaginationFlag
      : '',
  TaskExecutionDDMEndPoint:
    window['__env'] && window['__env'].TaskExecutionDDMEndPoint
      ? window['__env'].TaskExecutionDDMEndPoint
      : '',
  ExportCompliance: window['__env'] && window['__env'].ExportCompliance
    ? window['__env'].ExportCompliance
    : '',
  pageRowCounters: window['__env'] && window['__env'].pageRowCounters
    ? window['__env'].pageRowCounters
    : '',
  enableSearchNewWindowFlag: window['__env'] && window['__env'].enableSearchNewWindowFlag
    ? window['__env'].enableSearchNewWindowFlag
    : '',
  EKSPWPlayReportsURL: window['__env'] && window['__env'].EKSPWPlayReportsURL
    ? window['__env'].EKSPWPlayReportsURL
    : '',

  loadingYourContentWidgetIntervalTimeInMs:
    window['__env'] && window['__env'].loadingYourContentWidgetIntervalTimeInMs
      ? window['__env'].loadingYourContentWidgetIntervalTimeInMs
      : '',

  enableAutoRefreshYourContentWidget:
    window['__env'] && window['__env'].enableAutoRefreshYourContentWidget
      ? window['__env'].enableAutoRefreshYourContentWidget
      : '',

  enableAutoRefreshYourTodoWidget:
    window['__env'] && window['__env'].enableAutoRefreshYourTodoWidget
      ? window['__env'].enableAutoRefreshYourTodoWidget
      : '',

  enableAutoRefreshYourTaskWidget:
    window['__env'] && window['__env'].enableAutoRefreshYourTaskWidget
      ? window['__env'].enableAutoRefreshYourTaskWidget
      : '',

  SSRSContentAttributes:
  window['__env'] && window['__env'].SSRSContentAttributes
    ? window['__env'].SSRSContentAttributes
    : '',

  SSRSContentTaskStatus:
  window['__env'] && window['__env'].SSRSContentTaskStatus
    ? window['__env'].SSRSContentTaskStatus
    : '',

  SSRSContentTaskDeviations:
  window['__env'] && window['__env'].SSRSContentTaskDeviations
    ? window['__env'].SSRSContentTaskDeviations
    : '',

  SSRSContentCriteriaDeviation:
  window['__env'] && window['__env'].SSRSContentCriteriaDeviation
    ? window['__env'].SSRSContentCriteriaDeviation
    : '',

  QlikAdminContentManagement:
  window['__env'] && window['__env'].QlikAdminContentManagement
    ? window['__env'].QlikAdminContentManagement
    : '',

  QlikAdminEKSMetricsUser:
  window['__env'] && window['__env'].QlikAdminEKSMetricsUser
    ? window['__env'].QlikAdminEKSMetricsUser
    : '',

  disableUnCompletedFeatures:
    window['__env'] && window['__env'].disableUnCompletedFeatures
      ? window['__env'].disableUnCompletedFeatures
      : '',

  authorGuidances:
    window['__env'] && window['__env'].authorGuidances
      ? window['__env'].authorGuidances
      : {},
  disableTaskSearchAndTaskCreation:
    window['__env'] && window['__env'].disableTaskSearchAndTaskCreation
      ? window['__env'].disableTaskSearchAndTaskCreation
      : '',

  disableStepAndStepFlowCreation:
    window['__env'] && window['__env'].disableStepAndStepFlowCreation
      ? window['__env'].disableStepAndStepFlowCreation
      : '',

  disableObsoleteDocuments:
    window['__env'] && window['__env'].disableObsoleteDocuments
      ? window['__env'].disableObsoleteDocuments
      : '',

  SSRSContentSummary:
  window['__env'] && window['__env'].SSRSContentSummary
    ? window['__env'].SSRSContentSummary
    : '',

  SSRSContentActivityStatusIncomplete:
  window['__env'] && window['__env'].SSRSContentActivityStatusIncomplete
    ? window['__env'].SSRSContentActivityStatusIncomplete
    : '',

  SSRSContentctivityStatusDetailed:
  window['__env'] && window['__env'].SSRSContentctivityStatusDetailed
    ? window['__env'].SSRSContentctivityStatusDetailed
    : '',


  SSRSContenteTaskCriteriaReport:
  window['__env'] && window['__env'].SSRSContenteTaskCriteriaReport
    ? window['__env'].SSRSContenteTaskCriteriaReport
    : '',

  SSRSContentTaskContentRevisionCheck:
  window['__env'] && window['__env'].SSRSContentTaskContentRevisionCheck
    ? window['__env'].SSRSContentTaskContentRevisionCheck
    : '',

  SSRSContentProgramDeviation:
  window['__env'] && window['__env'].SSRSContentProgramDeviation
    ? window['__env'].SSRSContentProgramDeviation
    : '',



  SSRSContentTaskIdEnable:
  window['__env'] && window['__env'].SSRSContentTaskIdEnable
    ? window['__env'].SSRSContentTaskIdEnable
    : '',

  expertsFinder:
  window['__env'] && window['__env'].expertsFinder
    ? window['__env'].expertsFinder
    : '',

  engineexplorer:
  window['__env'] && window['__env'].engineexplorer
    ? window['__env'].engineexplorer
    : '',

  SSRSContentAllTaskReportsStatus:
  window['__env'] && window['__env'].SSRSContentAllTaskReportsStatus
    ? window['__env'].SSRSContentAllTaskReportsStatus
    : '',
};
