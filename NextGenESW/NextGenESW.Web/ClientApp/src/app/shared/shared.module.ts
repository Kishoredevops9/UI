import { InsertVideoComponent } from '@app/shared/component/insert-video/insert-video.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SafeurlPipe } from './pipe/safeurl.pipe';
import { UniquePipe } from '../UniquePipe.pipe';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { PropertiesComponent } from './component/properties/properties.component';
import { ItemLayoutComponent } from './component/item-layout/item-layout.component';
import { WiDisciplineTreeComponent } from './component/properties/wi-discipline-tree/wi-discipline-tree.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CreateDocumentModule } from '@app/create-document/create-document.module';
import { DiscipineTreeComponent } from './component/properties/discipine-tree/discipine-tree.component';
import { DisciplineComponent } from './component/properties/discipline/discipline.component';
import { GlobalPanelComponent } from './component/global-panel/global-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommentsComponent } from './component/global-panel/comments/comments.component';
import { LessonLearnedComponent } from './component/lesson-learned/lesson-learned.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TopMenuActionsComponent } from './component/top-menu-actions/top-menu-actions.component';
import { SubMenuActionsComponent } from './component/sub-menu-actions/sub-menu-actions.component';
import { TagTreeComponent } from './component/properties/tag-tree/tag-tree.component';
import { GlobalSearchDetailsComponent } from './component/global-search-details/global-search-details.component';
import { EksInternalSearchComponent } from './component/global-search-details/eks-internal-search/eks-internal-search.component';
import { GlobalContentListComponent } from './component/global-search-details/global-content-list/global-content-list.component';
import { LeftSectionSearchComponent } from './component/left-section-search/left-section-search.component';
import { ExportComplianceComponent } from './component/top-menu-actions/export-compliance/export-compliance.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { LeftBoxComponent } from './component/left-box/left-box.component';
import { LeftSectionBuildTaskComponent } from './component/left-section-build-task/left-section-build-task.component';
import { GlobalInnerContentComponent } from './component/global-search-details/global-inner-content/global-inner-content.component';
import { TaskCreationMapTreeComponent } from '@app/shared/component/map-tree/map-tree.component';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { LeftSectionCustomizeTaskComponent } from '@app/shared/component/left-section-customize-task/left-section-customize-task.component';
import { CustomizeTaskMapTreeComponent } from '@app/shared/component/customize-task-map-tree/customize-task-map-tree.component';
import { AdvanceSearchComponent } from './component/global-search-details/global-inner-content/advance-search/advance-search.component';
import { ShareUrlComponent } from './component/global-search-details/global-inner-content/share-url/share-url.component';
import { MenuPanelComponent } from '@app/shared/component/menu-panel/menu-panel.component';
import { UserHelpComponent } from '@app/shared/component/user-help-menu/user-help-menu.component';
import { EksFilterSectionComponent } from './component/global-search-details/global-inner-content/eks-filter-section/eks-filter-section.component';
import { EksTabResultComponent } from './component/global-search-details/global-inner-content/eks-tab-result/eks-tab-result.component';
import { GlobalSearchResultComponent } from './component/global-search-details/global-inner-content/global-search-result/global-search-result.component';
import { VbrickResultComponent } from './component/global-search-details/global-inner-content/vbrick-result/vbrick-result.component';
import { TopEksSearchbarComponent } from './component/global-search-details/global-inner-content/top-eks-searchbar/top-eks-searchbar.component';
import { NocComponent } from './component/noc/noc.component';
import { EKSSearchLeftBoxComponent } from '@app/shared/component/eks-search-left-box/eks-search-left-box.component';
import { GlobalFormPopupComponent } from './component/global-form-popup/global-form-popup.component';
import { SafePipe } from '../safe.pipe';
import { TooltipModule } from '@app/shared/_tooltip';
import { ClassifierModalComponent } from './component/properties/classifier-modal/classifier-modal.component';
import { HighlightSearch } from '@app/shared/pipe/shared.pipe';
import { ProgressbarComponent } from './component/progressbar/progressbar.component';
import { StepsKpackComponent } from './component/steps-kpack/steps-kpack.component';
import { LoadingComponent } from '@app/shared/component/loading/loading';
import { TaskBuildComponent } from './component/left-section-build-task/task-build/task-build.component';

import { RouterModule } from '@angular/router';
import { TaskBuildSelectedComponent } from './component/left-section-build-task/task-build-selected/task-build-selected.component';
import { BuildTaskSelectedTreeComponent } from './component/left-section-build-task/task-build-selected/build-task-selected-tree/build-task-selected-tree.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { EksInternalTabComponent } from '@app/shared/component/global-search-details/eks-internal-search/eks-internal-tab/eks-internal-tab.component';
import { EksGlobalTabComponent } from '@app/shared/component/global-search-details/eks-internal-search/eks-global-tab/eks-global-tab.component';
import { EksVideoTabComponent } from '@app/shared/component/global-search-details/eks-internal-search/eks-video-tab/eks-video-tab.component';
import { EksTopSearchbarComponent } from '@app/shared/component/global-search-details/eks-internal-search/eks-top-searchbar/eks-top-searchbar.component';
import { SpecificStepFlowComponent } from './component/left-section-build-task/specific-step-flow/specific-step-flow.component';
import { AddNewStepComponent } from './component/left-section-build-task/add-new-step/add-new-step.component';
import { NewActivityPopupComponent } from './component/left-section-build-task/new-activity-popup/new-activity-popup.component';
import { AddDisciplinePopupComponent } from './component/left-section-build-task/add-discipline-popup/add-discipline-popup.component';
import { ReleasePopupComponent } from './component/left-section-build-task/release-popup/release-popup.component';
import { EksaddonsFilterComponent } from '@app/shared/component/global-search-details/global-inner-content/eksaddons-filter/eksaddons-filter.component';
import { orderByAlphabetPipe } from './pipe/alphabet.pipe';
import { EksaddonsConfirmpopupComponent } from './component/left-section-build-task/eksaddons-confirmpopup/eksaddons-confirmpopup.component';
import { TaskSearchComponent } from './component/task-search/task-search.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { PaginationCachingDirective } from '@app/shared/directive/pagination-caching.directive';
import { HtmlViewerComponent } from '@app/shared/component/html-viewer/html-viewer.component';
import { ConfirmObsoleteDialogComponent } from '@app/shared/component/confirm-obsolete-dialog/confirm-obsolete-dialog.component';
import {
  RelatedObsoleteContentListComponent
} from '@app/shared/component/confirm-obsolete-dialog/related-obsolete-content-list/related-obsolete-content-list.component';
import {
  RelatedObsoleteTaskListComponent
} from '@app/shared/component/confirm-obsolete-dialog/related-obsolete-task-list/related-obsolete-task-list.component';
import { SelectItemListComponent } from './component/select-item-list/select-item-list.component';
import { ScrollableTableComponent } from './component/mat-table/scroll-table/scrollable-table.component';
import { MatTableComponent } from './component/mat-table/mat-table.component';
import { AddonsPopupSearchComponent } from './component/addons-popup-search/addons-popup-search.component';
import { AddonsSearchBarComponent } from './component/addons-popup-search/addons-search-bar/addons-search-bar.component';
import { AddonsPwplayResultComponent } from './component/addons-popup-search/addons-pwplay-result/addons-pwplay-result.component';
import { AddonsGlobalResultComponent } from './component/addons-popup-search/addons-global-result/addons-global-result.component';
import { AddonsEksResultComponent } from './component/addons-popup-search/addons-eks-result/addons-eks-result.component';
import { AddonsAdvancedSearchPanelComponent } from './component/addons-popup-search/addons-advanced-search-panel/addons-advanced-search-panel.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {};

const SharedComponents = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatInputModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatTabsModule,
  MatRadioModule,
  MatSnackBarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatTreeModule,
  MatAutocompleteModule,
  DragDropModule,
  MatChipsModule,
  FormsModule,
  ReactiveFormsModule,
  MatExpansionModule,
  MatSortModule,
  OverlayModule,
  PortalModule,
  TreeModule,
];

@NgModule({
  declarations: [
    SafeurlPipe,
    SafePipe,
    UniquePipe,
    PropertiesComponent,
    ItemLayoutComponent,
    WiDisciplineTreeComponent,
    DiscipineTreeComponent,
    DisciplineComponent,
    GlobalPanelComponent,
    CommentsComponent,
    LessonLearnedComponent,
    TopMenuActionsComponent,
    SubMenuActionsComponent,
    TagTreeComponent,
    GlobalSearchDetailsComponent,
    EksInternalSearchComponent,
    GlobalContentListComponent,
    ExportComplianceComponent,
    LeftSectionSearchComponent,
    LeftBoxComponent,
    GlobalInnerContentComponent,
    LeftSectionBuildTaskComponent,
    TaskCreationMapTreeComponent,
    LeftSectionCustomizeTaskComponent,
    CustomizeTaskMapTreeComponent,
    AdvanceSearchComponent,
    ShareUrlComponent,
    MenuPanelComponent,
    UserHelpComponent,
    EksFilterSectionComponent,
    EksTabResultComponent,
    GlobalSearchResultComponent,
    VbrickResultComponent,
    TopEksSearchbarComponent,
    NocComponent,
    EKSSearchLeftBoxComponent,
    GlobalFormPopupComponent,
    ClassifierModalComponent,
    HighlightSearch,
    ProgressbarComponent,
    StepsKpackComponent,
    InsertVideoComponent,
    LoadingComponent,
    TaskBuildComponent,
    TaskBuildSelectedComponent,
    BuildTaskSelectedTreeComponent,
    EksInternalTabComponent,
    EksGlobalTabComponent,
    EksVideoTabComponent,
    EksTopSearchbarComponent,
    SpecificStepFlowComponent,
    AddNewStepComponent,
    NewActivityPopupComponent,
    AddDisciplinePopupComponent,
    ReleasePopupComponent,
    EksaddonsFilterComponent,
    orderByAlphabetPipe,
    EksaddonsConfirmpopupComponent,
    TaskSearchComponent,
    TexteditorComponent,
    PaginationCachingDirective,
    HtmlViewerComponent,
    ConfirmObsoleteDialogComponent,
    RelatedObsoleteContentListComponent,
    RelatedObsoleteTaskListComponent,
    SelectItemListComponent,
    ScrollableTableComponent,
    MatTableComponent,
    AddonsPopupSearchComponent,
    AddonsSearchBarComponent,
    AddonsPwplayResultComponent,
    AddonsGlobalResultComponent,
    AddonsEksResultComponent,
    AddonsAdvancedSearchPanelComponent
  ],
  imports: [
    ...SharedComponents,
    CommonModule,
    AngularEditorModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    TooltipModule,
    RouterModule,
    NgxPaginationModule
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
  exports: [
    ...SharedComponents,
    SafeurlPipe,
    SafePipe,
    UniquePipe,
    PropertiesComponent,
    ItemLayoutComponent,
    LeftBoxComponent,
    GlobalPanelComponent,
    LessonLearnedComponent,
    TopMenuActionsComponent,
    SubMenuActionsComponent,
    GlobalSearchDetailsComponent,
    EksInternalSearchComponent,
    GlobalContentListComponent,
    ExportComplianceComponent,
    DisciplineComponent,
    LeftSectionSearchComponent,
    DiscipineTreeComponent,
    TagTreeComponent,
    LeftSectionBuildTaskComponent,
    TaskCreationMapTreeComponent,
    LeftSectionCustomizeTaskComponent,
    CustomizeTaskMapTreeComponent,
    MenuPanelComponent,
    UserHelpComponent,
    NocComponent,
    EKSSearchLeftBoxComponent,
    AdvanceSearchComponent,
    EksFilterSectionComponent,
    EksTabResultComponent,
    GlobalSearchResultComponent,
    VbrickResultComponent,
    TopEksSearchbarComponent,
    ClassifierModalComponent,
    HighlightSearch,
    ProgressbarComponent,
    StepsKpackComponent,
    InsertVideoComponent,
    LoadingComponent,
    EksInternalTabComponent,
    EksGlobalTabComponent,
    EksVideoTabComponent,
    EksTopSearchbarComponent,
    EksaddonsFilterComponent,
    orderByAlphabetPipe,
    TexteditorComponent,
    PaginationCachingDirective,
    HtmlViewerComponent,
    ConfirmObsoleteDialogComponent,
    RelatedObsoleteContentListComponent,
    RelatedObsoleteTaskListComponent,
    SelectItemListComponent,
    ScrollableTableComponent,
    MatTableComponent,
    AddonsPopupSearchComponent,
    AddonsSearchBarComponent,
    AddonsPwplayResultComponent,
    AddonsGlobalResultComponent,
    AddonsEksResultComponent,
    AddonsAdvancedSearchPanelComponent
  ],
})
export class SharedModule { }
