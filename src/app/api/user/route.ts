import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'user.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ user: null });
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return NextResponse.json({ user: JSON.parse(data) });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age } = body;

    if (!name || !age) {
      return NextResponse.json({ error: 'Name and age required' }, { status: 400 });
    }

    const user = { name: name.trim(), age: parseInt(age) };
    fs.writeFileSync(DATA_FILE, JSON.stringify(user, null, 2), 'utf-8');
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}