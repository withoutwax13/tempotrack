import { NextResponse } from "next/server";
import supabase from "../../../services/supabaseClient";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || undefined;
  const user_id = searchParams.get("user_id") || undefined;
  const membership_id = searchParams.get("membership_id") || undefined;

  const isNoQuery =
    [id, user_id, membership_id].filter((query) => query !== undefined)
      .length === 0;
  const isMoreThanOneQuery =
    [id, user_id, membership_id].filter((query) => query !== undefined).length >
    1;

  if (isNoQuery) {
    const { data, error } = await supabase.from("budgets").select("*");
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else if (isMoreThanOneQuery) {
    return NextResponse.json(
      { error: "Invalid request: Only 1 param is allowed" },
      { status: 400 }
    );
  } else if (id) {
    const { data, error } = await supabase
      .from("budgets")
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
      .from("budgets")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else if (membership_id) {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("membership_id", membership_id);
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();
  const {
    name,
    description,
    timerange,
    start_date,
    end_date,
    tags,
    total_hours,
    status,
    isPartOfTeam,
  } = body;
  const allowedStatus = ["active", "draft", "closed"];
  if (isPartOfTeam) {
    const { membership_id } = body;
    if (!membership_id) {
      return NextResponse.json(
        { error: "Missing membership_id in request body" },
        { status: 400 }
      );
    }
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status in request body" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase.from("budgets").insert([
      {
        name: name,
        description: description,
        timerange: timerange,
        start_date: start_date,
        end_date: end_date,
        tags: tags,
        total_hours: total_hours,
        status: status,
        membership_id: membership_id,
      },
    ]);
    if (error) {
      console.error(error.message);
      return NextResponse.json(error.message);
    } else {
      return NextResponse.json(data);
    }
  } else {
    const { user_id } = body;
    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id in request body" },
        { status: 400 }
      );
    }
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status in request body" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase.from("budgets").insert([
      {
        name: name,
        description: description,
        timerange: timerange,
        start_date: start_date,
        end_date: end_date,
        tags: tags,
        total_hours: total_hours,
        status: status,
        user_id: user_id,
      },
    ]);
    if (error) {
      console.error(error.message);
      return NextResponse.json(error.message);
    } else {
      return NextResponse.json(data);
    }
  }
};
