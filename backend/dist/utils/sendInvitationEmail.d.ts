interface SendInvitationEmailProps {
    to: string;
    inviterName: string;
    workspaceName: string;
    inviteLink: string;
}
export declare const sendInvitationEmail: ({ to, inviterName, workspaceName, inviteLink, }: SendInvitationEmailProps) => Promise<void>;
export {};
//# sourceMappingURL=sendInvitationEmail.d.ts.map