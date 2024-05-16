import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { StringFieldComponent, TotsActionForm } from '@tots/form';
import { TotsConfigDynamicWizardForm, TotsConfigWizardForm } from '@tots/form-wizard';
import { of } from 'rxjs';

@Component({
  selector: 'app-form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrls: ['./form-wizard.component.scss']
})
export class FormWizardComponent implements OnInit {
  config!: TotsConfigWizardForm;
  configDynamic!: TotsConfigDynamicWizardForm;

  constructor() { }

  ngOnInit(): void {
    this.loadConfig();
    this.loadConfigDynamic();
  }

  onActionForm(action: TotsActionForm) {
    if(action.key == 'load-item'){
      action.item.isLoading = true;
      setTimeout(() => { action.item.isLoading = false }, 2000);
    } else if(action.key == 'submit'){
      console.log(action.item);
    }
  }

  loadConfig() {
    this.config = new TotsConfigWizardForm();
    this.config.title = 'Form Wizard Title';
    this.config.item = { subtitle: 'Testing' };
    this.config.steps = [

      {
        key: 'step-one',
        title: 'Step One',
        fields: [
          { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' }, errors: [{ name: 'required', message: 'You must enter a value' }] },
        ]
      },
      {
        key: 'step-two',
        title: 'Step Two',
        fields: [
          { key: 'subtitle', component: StringFieldComponent, label: 'Subtitle', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' }, errors: [{ name: 'required', message: 'You must enter a value' }] },
        ]
      }

    ];
  }

  loadConfigDynamic() {
    this.configDynamic = new TotsConfigDynamicWizardForm();
    this.configDynamic.title = 'Form Wizard Dynamic';
    this.configDynamic.item = { subtitle: 'Testing' };
    this.configDynamic.onChange = (stepIndex: number) => {
      console.log(this.configDynamic.item);
      if(stepIndex == 0){
        return of(
          [
            { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' }, errors: [{ name: 'required', message: 'You must enter a value' }] },
          ]
        );
      } else {
        return of(
          [
            { key: 'subtitle', component: StringFieldComponent, label: 'Subtitle Dynamic', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' }, errors: [{ name: 'required', message: 'You must enter a value' }] },
          ]
        );
      }


    };
    this.configDynamic.steps = [
      {
        key: 'step-one',
        title: 'Step One',
      },
      {
        key: 'step-two',
        title: 'Step Two'
      }
    ];
  }
}
