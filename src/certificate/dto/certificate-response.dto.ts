export class CertificateResponseDto {
    id: number;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    completionPercentage: number;
    issuedDate: Date;
    expiryDate?: Date;
    isActive: boolean;
    certificateUrl?: string;
    certificatePdfUrl?: string;
    student?: {
        id: number;
        name: string;
        email: string;
    };
    course?: {
        id: number;
        name: string;
        slugName: string;
    };
    enrollment?: {
        id: number;
        status: string;
        progress: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
