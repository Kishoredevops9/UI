import { Validators } from "@angular/forms";

export interface announceTableList {
    Title: string;
    Type: string;
    Status: string;
    CreatedModifiedDate: number;
    CreatedModifiedBy: string;
    description: string;
    dateofpost: string;
    expirationdate : string;  
}
const regex = '(https?://)?([\\da-z.-]+)\\.([a-z.:]{2,6})[/\\w .-]*/?';
export const announceFormModal =[
    {
        type: 'text',
        label: 'Title',
        formControlName: 'title',
        column: 'Title',
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please provide Title'
            }
        ]
    },
    {
        type: 'dropdown',
        label: 'Type',
        formControlName: 'type',
        column: 'Type',
        value: [
            // {
            //     value: 'Engineering'
            // },
            // {
            //     value: 'Aviation'
            // }
        ],
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please select Type'
            }
        ]
    },
    {
        type: 'dropdown',
        label: 'Status',
        formControlName: 'status',
        column: 'Status',
        value: [
            {
                id : 'Show',
                name: 'Show'
            },
            {
                id: 'Hide',
                name: 'Hide'
            }
        ]
    },
    {
        type: 'textarea',
        label: 'Description',
        formControlName: 'description',
        column: 'Description',
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please provide Description'
            }
        ]
    },
    {
        type: 'date',
        label: 'Date of Post',
        formControlName: 'dateofpost',
        column: 'Date of Post',
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please provide Date of Post'
            }
        ]
    },
    {
        type: 'date',
        label: 'Expiration Date',
        formControlName: 'expirtaiondate',
        column: 'Expiration Date',
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please provide Expiration Date'
            }
        ]
    },
    {
        type: 'url',
        label: 'Link',
        formControlName: 'link',
        column: 'Link',
        validation: [
            {
                validate: Validators.required,
                validationType: 'required',
                errorMessage : 'Please provide Link'
            },
            {
                validate: Validators.pattern(regex),
                validationType: 'pattern',
                errorMessage : 'Please provide validate Link'
            }
        ]
    },
    {
        type: 'button',
        buttons: [
            {
                label: 'Save',
                column: 'Save',
                className: 'btn-save',
                action: 'Submit'
            },
            {
                label: 'Cancel',
                column: 'Cancel',
                className: 'btn-cancel',
                action: 'Cancel'
            }
        ]
        
    }
] 
