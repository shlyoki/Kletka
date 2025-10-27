import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';
import { deleteSessionsForUser, getUserById, setUserRole } from '@/lib/user-store';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const session = await auth();
  if (!session.user?.isOwner) {
    return NextResponse.json({ error: 'Only the owner can update roles.' }, { status: 403 });
  }

  const targetId = params.userId;
  const body = await request.json().catch(() => ({}));
  const roleValue = typeof body.role === 'string' ? body.role : '';
  if (!roleValue || !(roleValue in Role)) {
    return NextResponse.json({ error: 'A valid role is required.' }, { status: 400 });
  }
  const role = Role[roleValue as keyof typeof Role];

  const targetUser = await getUserById(targetId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  if (targetUser.isOwner && targetUser.id !== session.user.id) {
    return NextResponse.json({ error: 'Owner role cannot be reassigned.' }, { status: 400 });
  }

  await setUserRole(targetId, role);
  await deleteSessionsForUser(targetId);

  return NextResponse.json({
    user: {
      id: targetId,
      role,
    },
  });
}
