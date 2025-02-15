import { NextResponse } from "next/server";
import supabase from "../../../services/supabaseClient";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const user_id = searchParams.get("user_id");
  if (!id && !user_id) {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else if (id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else if (user_id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();
  const { user_id, username } = body;
  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id in request body" },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: "Missing username in request body" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("users").insert([
    {
      user_id: user_id,
      username: username,
    },
  ]);

  if (error) {
    console.error(error.message);
    return NextResponse.json(error.message);
  } else {
    return NextResponse.json(data);
  }
};
