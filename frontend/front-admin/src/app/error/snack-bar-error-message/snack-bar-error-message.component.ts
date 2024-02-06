import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-snack-bar-error-message',
  templateUrl: './snack-bar-error-message.component.html',
  styleUrls: ['./snack-bar-error-message.component.scss']
})
export class SnackBarErrorMessageComponent {

  message: string;

  constructor(//@Inject(MAT_SNACK_BAR_DATA) public data: any, 
              // public translateService: TranslateService,
              // public languageService: LanguageService,
              // private fuseTranslationLoader: FuseTranslationLoaderService
              ) {
    //this.fuseTranslationLoader.loadTranslations(english, german);
  //  this.message = this.generateMessage(data);
  }

  ngOnInit() {
  }

  generateMessage(m: string): string {
    const messageTokens = m.split('*');
    let message = '';
    let i = 0;
    while (i < messageTokens.length) {
      // if (i % 2 === 0) {
      //   //  this.translateService.get(messageTokens[i]).subscribe(res => {
      //   //    if (res === messageTokens[i]) {
      //   //     message =  this.getTranslatedDefaultMessage();
      //   //     return messageTokens;
      //      } else {
      //        message += res;
      //      }
      //   });
      // } else {
      //   message += ': ' + messageTokens[i] + ' ';
      // }
      // i++;
    }
    return message;
  }

  getTranslatedDefaultMessage(): string {
    // if (this.languageService.selectedLanguage.code === 'en') {
    //   return DEFAULT_ERROR_MESSAGE_EN;
    // } else {
    //  // return DEFAULT_ERROR_MESSAGE_DE;
    // }
    return DEFAULT_ERROR_MESSAGE_EN;
  }
}

export const DEFAULT_ERROR_MESSAGE_EN = 'Something went wrong.';


