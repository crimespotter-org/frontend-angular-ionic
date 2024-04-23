import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonText,
  IonTextarea,
  IonToolbar
} from "@ionic/angular/standalone";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../../services/supabase.service";
import {StorageService} from "../../../services/storage.service";
import {addIcons} from "ionicons";
import {send} from "ionicons/icons";
import {CaseDetailsService} from "../../../services/case-details.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-case-chat',
  templateUrl: './case-chat.component.html',
  styleUrls: ['./case-chat.component.scss'],
  imports: [
    IonLabel,
    IonItem,
    NgIf,
    IonInput,
    FormsModule,
    IonButton,
    DatePipe,
    NgForOf,
    IonContent,
    IonList,
    IonNote,
    IonFooter,
    IonIcon,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonText,
    IonTextarea,
    IonAvatar
  ],
  standalone: true
})
export class CaseChatComponent implements OnInit,OnDestroy,AfterViewChecked {
  @Input() caseId: any;
  @ViewChild('chatContainer') private chatContainerRef: ElementRef | undefined;
  comments: any[] = [];
  newCommentText?: string | null = '';
  userId: string | null = '';
  private subs = new Subscription();

  constructor(private supabaseService: SupabaseService,
              private storageService: StorageService,
              private caseDetailsService: CaseDetailsService) {
    addIcons({send});
  }

  ngOnInit() {
    this.subs.add(this.caseDetailsService.caseComments$.subscribe(comments => {
      if (Array.isArray(comments)) {
        comments.forEach(x => {
          this.comments.push(x)
        })
      } else {
        this.comments.push(comments);
      }
    }));

    this.userId = this.storageService.getUserId();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if(this.chatContainerRef) this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
    } catch(err) { }
  }

  addComment() {
    if (this.newCommentText && !this.newCommentText.trim()) return;
    if (this.userId && this.newCommentText) {
      this.supabaseService.addComment(this.caseId, this.userId, this.newCommentText).then(() => {
        this.newCommentText = '';
      });
    }
  }

  isMyMessage(comment: any) {
    return comment.user_id === this.userId;
  }
}
