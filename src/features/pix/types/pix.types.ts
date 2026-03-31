export type PixContact = {
    id: string
    name: string
    pixKey: string
    bankName: string
}

export type PixTransferLogStep =
    | "PIX_OPENED"
    | "PIX_KEY_FILLED"
    | "PIX_CONTACT_SELECTED"
    | "PIX_AMOUNT_FILLED"
    | "PIX_AMOUNT_CONFIRMED"
    | "PIX_PASSWORD_FILLED"
    | "PIX_TOKEN_FILLED"
    | "PIX_TRANSFER_CONFIRMED"
    | "PIX_RECEIPT_VIEWED"
    | "PIX_FINISHED"

export type PixTransferLog = {
    id: string
    step: PixTransferLogStep
    timestamp: string
    details?: Record<string, string | number>
}

export type PixTransferReceipt = {
    transactionId: string
    recipientName: string
    recipientPixKey: string
    recipientBankName: string
    senderInstitution: string
    amount: number
    receivedAmount: number
    createdAt: string
}