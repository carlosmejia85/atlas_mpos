import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  ptype:any= 'password';

  constructor() { }

  ngOnInit() {
  }

  changeType()
  {
    if(this.ptype == 'password')
    {
      this.ptype = 'text'
    }

    else
    {
      this.ptype = "password"
    }
  }

}
