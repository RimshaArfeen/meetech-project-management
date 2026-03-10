

import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../../../../../lib/auth/jwt';
import prisma from '../../../../../../../lib/auth/jwt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
     try {
          const token = request.cookies.get('accessToken')?.value;

          if (!token) {
               return NextResponse.json(
                    { error: 'Not authenticated' },
                    { status: 401 }
               );
          }

          const decoded = verifyAccessToken(token);
          if (!decoded || decoded.role !== 'TEAM_LEAD') {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          const formData = await request.formData();
          const file = formData.get('file');
          const projectId = formData.get('projectId');

          if (!file) {
               return NextResponse.json(
                    { error: 'No file uploaded' },
                    { status: 400 }
               );
          }

          // Validate file type
          const validTypes = [
               'image/jpeg', 'image/png', 'image/gif', 'image/webp',
               'application/pdf', 'text/plain', 'application/json',
               'application/zip', 'application/x-zip-compressed'
          ];

          if (!validTypes.includes(file.type)) {
               return NextResponse.json(
                    { error: 'Invalid file type. Please upload images, PDF, text, or ZIP files.' },
                    { status: 400 }
               );
          }

          // Validate file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
               return NextResponse.json(
                    { error: 'File too large. Maximum size is 10MB' },
                    { status: 400 }
               );
          }

          // Convert file to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const ext = path.extname(file.name);
          const filename = `issue-${uuidv4()}${ext}`;

          // Ensure upload directory exists
          const uploadDir = path.join(process.cwd(), 'public/uploads/issues');
          await mkdir(uploadDir, { recursive: true });

          // Save file
          const filepath = path.join(uploadDir, filename);
          await writeFile(filepath, buffer);

          // Public URL
          const fileUrl = `/uploads/issues/${filename}`;

          // Create document record if projectId is provided
          let document = null;
          if (projectId) {
               document = await prisma.document.create({
                    data: {
                         name: file.name,
                         fileName: filename,
                         fileSize: file.size,
                         fileType: file.type,
                         url: fileUrl,
                         type: 'PROJECT_DOC',
                         projectId,
                         uploadedById: decoded.id
                    }
               });
          }

          return NextResponse.json({
               success: true,
               fileUrl,
               fileName: file.name,
               fileSize: file.size,
               document
          });

     } catch (error) {
          console.error('File upload error:', error);
          return NextResponse.json(
               { error: 'Failed to upload file' },
               { status: 500 }
          );
     }
}