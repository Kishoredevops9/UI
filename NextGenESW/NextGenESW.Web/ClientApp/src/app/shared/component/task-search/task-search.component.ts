import { Component, OnInit } from '@angular/core';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '@app/shared/shared.service';
@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss'],
})
export class TaskSearchComponent implements OnInit {
  masterLength: number;
  pageEvent: PageEvent;
  searchData: String;
  edpendData: number;
  isOpen : boolean = false;
  query: any;
  rp: any;
  tableData: any;
  filterData: any;
  length = 0;
  pageSize = 50;
  pageSizeOptions: number[] = [50, 100];
  displayedColumns: string[] = [
    'title',
    'taskreaid',
    'enginemodelgroup',
    'enginesection',
    'status',
    'taskid',
    
  ];
  dataSource: any;
  masterData: any;
  masterFilterData: any;
  constructor(
    public TaskItemsListService: TaskItemsListService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public SharedService : SharedService
  ) {}

  tagObj: any = {
    enginesection: 'Engine Section',
    initialenginemodel: 'Initial Engine Model',
    enginemodelgroup: 'Engine Model Group',
    tags: 'Tags',
    phasenames: 'Phase',
  };
  filterSearch($event) {
    if (this.searchData && this.searchData.length) {
      this.edpendData = 1;
      let tempData = JSON.parse(JSON.stringify(this.masterFilterData));
      tempData.map((node) => {
        node['expend'] = true;
        node.children = node.children.filter((val) => {
          return val.name.toLowerCase().includes(this.searchData.toLowerCase());
        });
      });

      this.filterData = tempData.filter((e) => {
        return e['children'].length;
      });
    } else {
      this.edpendData = 2;
      this.filterData = [...this.masterFilterData];
    }
  }

  getArrayMatch(arrays) {
    let result = arrays.shift().filter(function (v) {
      return arrays.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    return result.length;
  }

  tagData($data) { 
    let tData = {};  
    $data.forEach(element => {
      if  ( tData.hasOwnProperty(element.parentId) ){ 
        tData[element.parentId].push(element.name) 
      }
      else{
        tData[element.parentId] = [];
        tData[element.parentId].push(element.name) 
      }  
    });  
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.rp = params['rp']; 
      let Query = 
           {
                "searchText": params['q'],
                "programNames": params['rp'].replaceAll(",","|"),
                "phases": (tData.hasOwnProperty('phasenames'))  ? tData['phasenames'].toString().replaceAll(",","|")  : "",
                "tags": (tData.hasOwnProperty('tags'))  ? tData['tags'].toString().replaceAll(",","|")  : "",
                "engineModelGroups":  (tData.hasOwnProperty('enginemodelgroup'))  ? tData['enginemodelgroup'].toString().replaceAll(",","|")  : "",
                "initialEngineModels":  (tData.hasOwnProperty('initialenginemodel'))  ? tData['initialenginemodel'].toString().replaceAll(",","|")  :  "", 
                "engineSections":  (tData.hasOwnProperty('enginesection'))  ? tData['enginesection'].toString().replaceAll(",","|")  :  "" , 
                "from": 0,
                "size": this.pageSize
           }


      this.TaskItemsListService.getSearchTaskListByFilter(Query).subscribe((data:any)=>{

      
        this.tableData = data.hits.hits;
        this.length = data.hits.total.value;
        this.SharedService.taskSearch.emit(this.length);
        this.masterLength = data.hits.total.value;
        this.tableData = this.tableData.map((node) => {
          return node._source;
        });
        this.dataSource = this.tableData;
        this.masterData = [...this.tableData];
     

  
      },err=>{

        console.log(err)
      })


      //this.getData(this.query, 0, this.pageSize);
    });


    // let tempObj = {};
    // $data.forEach((element) => {
    //   if (tempObj.hasOwnProperty(element.parentId)) {
    //     tempObj[element.parentId].push(element.name);
    //   } else {
    //     tempObj[element.parentId] = [];
    //     tempObj[element.parentId].push(element.name);
    //   }
    // });

    // if (Object.keys(tempObj).length == 0) {
    //   this.dataSource = [...this.masterData];
    //   this.length = this.masterLength;
    //   this.SharedService.taskSearch.emit(this.length)
    // } else {
    //   this.dataSource = [...this.masterData]
    //     .filter((node) => {
    //       if (tempObj['enginesection'] && tempObj['enginesection'].length) {
    //         return tempObj['enginesection'].indexOf(node.enginesection) > -1;
    //       } else {
    //         return true;
    //       }
    //     })
    //     .filter((node) => {
    //       if (
    //         tempObj['initialenginemodel'] &&
    //         tempObj['initialenginemodel'].length
    //       ) {
    //         return (
    //           tempObj['initialenginemodel'].indexOf(node.initialenginemodel) >
    //           -1
    //         );
    //       } else {
    //         return true;
    //       }
    //     })
    //     .filter((node) => {
    //       if (tempObj['tags'] && tempObj['tags'].length && node.tags) {
    //         // return (tempObj['tags'].indexOf(node.tags) > -1)
    //         let arrays = [tempObj['tags'], node.tags.split('|')];
    //         return this.getArrayMatch(arrays);
    //       } else {
    //         return true;
    //       }
    //     })
    //     .filter((node) => {
    //       if (
    //         tempObj['phasenames'] &&
    //         tempObj['phasenames'].length &&
    //         node.phasenames
    //       ) {
    //         //  return (tempObj['phasenames'].toString().includes(node.phasenames))
    //         let arrays = [tempObj['phasenames'], node.phasenames.split('|')];

    //         return this.getArrayMatch(arrays);
    //       } else {
    //         return true;
    //       }
    //     })
    //     .filter((node) => {
    //       if (
    //         tempObj['enginemodelgroup'] &&
    //         tempObj['enginemodelgroup'].length
    //       ) {
    //         return (
    //           tempObj['enginemodelgroup'].indexOf(node.enginemodelgroup) > -1
    //         );
    //       } else {
    //         return true;
    //       }
    //     });

    //   this.length = this.dataSource.length;
    //   this.SharedService.taskSearch.emit(this.length)
    // }
  }
  addNameKey($arg, d) {
    return (
      $arg &&
      $arg.map((node) => {
        return {
          name: node.key,
          id: this.randomString(8),
          parentId: d,
        };
      })
    );
  }
  getServerData(event?: PageEvent) {
    console.log(event);
    this.getData(this.query, event.pageIndex * event.pageSize, event.pageSize);
  }

  randomString(length) {
    var chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
      length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  getData(q, skip, limit) {
    this.TaskItemsListService.getSearchTaskList(q, skip, limit).subscribe(
      (data) => {
        this.tableData = data.hits.hits;
        this.length = data.hits.total.value;
        this.SharedService.taskSearch.emit(this.length);
        this.masterLength = data.hits.total.value;
        this.tableData = this.tableData.map((node) => {
          return node._source;
        });
        this.dataSource = this.tableData;
        this.masterData = [...this.tableData];
        this.filterData = data.aggregations ;
        this.filterData['enginesection'] = this.filterData['enginesections'];
        console.log(this.filterData);
        let tempObj = [];
        for (let d in this.filterData) {
          if (this.tagObj.hasOwnProperty(d)) {
            tempObj.push({
              name: this.tagObj[d],
              children: this.addNameKey(this.filterData[d].buckets, d),
              id: this.randomString(8),
            });
          }
        }

        console.log(tempObj);

        this.filterData = tempObj.filter((e) => {
          return e['children'].length;
        });
        this.masterFilterData = [...this.filterData];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openToggle($event){

    let fQuery = this.query+`&isOpen=${ this.isOpen }`;
    this.getData( fQuery , 0, this.pageSize);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.rp = params['rp'].replaceAll(",","|");

      this.query = `searchText=${params['q']}&programNames=${  this.rp }`;
      // curl -X GET "https://ekstasks-dev.azurewebsites.net/api/task/SearchTask?searchText=Task&programNames=F135&size=50" -H "accept: */*"
       let fQuery = this.query+`&isOpen=${ this.isOpen }`
      this.getData( fQuery , 0, this.pageSize);
    });
  }

  addToBookMark($id) {
    let param = {
      userId: sessionStorage.getItem('userMail'),
      taskId: $id,
    };
    this.TaskItemsListService.addToBookmark(param).subscribe(
      (data) => {
        this._snackBar.open(data['message'], 'Close', {
          duration: 3000,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
