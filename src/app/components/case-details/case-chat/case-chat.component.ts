import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {CaseDetailsService} from '../../../services/case-details.service';
import {SupabaseService} from '../../../services/supabase.service';
import {StorageService} from '../../../services/storage.service';
import {addIcons} from 'ionicons';
import {send} from 'ionicons/icons';
import {
  IonAvatar, IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent, IonIcon, IonItem, IonText, IonTextarea
} from "@ionic/angular/standalone";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Keyboard} from "@capacitor/keyboard";

@Component({
  selector: 'app-case-chat',
  templateUrl: './case-chat.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    NgForOf,
    IonAvatar,
    NgIf,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    DatePipe,
    IonItem,
    IonTextarea,
    FormsModule,
    IonButton,
    IonIcon
  ],
  styleUrls: ['./case-chat.component.scss']
})
export class CaseChatComponent implements OnInit, OnDestroy {
  @Input() caseId: any;
  @ViewChild(IonContent, {static: false}) private content!: IonContent;
  comments: any[] = [];
  newCommentText?: string | null = '';
  userId: string | null = '';
  private subs = new Subscription();

  constructor(
    private supabaseService: SupabaseService,
    private storageService: StorageService,
    private caseDetailsService: CaseDetailsService
  ) {
    addIcons({send});
  }

  ngOnInit() {
    this.subs.add(
      this.caseDetailsService.newComment$.subscribe((comment) => {
        const commentExists = this.comments.some(
          (existingComment) => existingComment.id === comment.id
        );

        if (!commentExists && comment.text) {
          this.comments.push(comment);
          this.sortComments();
          this.scrollToBottomIfAtBottom();
        }
      })
    );

    this.caseDetailsService.getComments().forEach((x) => {
      const commentExists = this.comments.some(
        (existingComment) => existingComment.id === x.id
      );

      if (!commentExists && x.text) {
        this.comments.push(x);
        if (this.isMyMessage(x)) {
        }
      }
      this.sortComments();
      this.scrollToBottom();
    });

    this.subs.add(
      this.caseDetailsService.caseComments$.subscribe((comments) => {
        comments.forEach((x) => {
          const commentExists = this.comments.some(
            (existingComment) => existingComment.id === x.id
          );

          if (!commentExists && x.text) {
            this.comments.push(x);
            this.sortComments();
            this.scrollToBottom();
          }
        });
      })
    );

    this.userId = this.storageService.getUserId();

    Keyboard.addListener('keyboardWillShow', () => {
      this.scrollToBottomIfAtBottomKeyBoard();
    });

    Keyboard.addListener('keyboardDidShow', () => {
      this.scrollToBottomIfAtBottomKeyBoard();
    });

    Keyboard.addListener('keyboardDidHide', () => {
      this.scrollToBottomIfAtBottomKeyBoard();
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.scrollToBottomIfAtBottomKeyBoard();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private async scrollToBottomIfAtBottomKeyBoard(): Promise<void> {
    const scrollElement = await this.content.getScrollElement();
    const threshold = 350;
    const position = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    console.log(position)
    let isAtBottom = position < threshold;
    if (isAtBottom) {
      this.scrollToBottom();
    }
  }

  private async scrollToBottomIfAtBottom(): Promise<void> {
    const scrollElement = await this.content.getScrollElement();
    const threshold = 80;
    const position = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    console.log(position)
    let isAtBottom = position < threshold;
    if (isAtBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 0);
  }

  addComment() {
    if (this.newCommentText && !this.newCommentText.trim()) return;
    if (this.userId && this.newCommentText) {
      this.supabaseService
        .addComment(this.caseId, this.userId, this.newCommentText)
        .then(() => {
          this.newCommentText = '';
        });
    }
  }

  isMyMessage(comment: any) {
    return comment.user_id === this.userId;
  }

  private sortComments(): void {
    this.comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
}
