import { NextResponse } from "next/server";
import supabase from "../../../services/supabaseClient";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || undefined;
  const user_id = searchParams.get("user_id") || undefined;
  const team_id = searchParams.get("team_id") || undefined;

  const isNoQuery =
    [id, user_id, team_id].filter((query) => query !== undefined).length === 0;
  const isMoreThanOneQuery =
    [id, user_id, team_id].filter((query) => query !== undefined).length > 1;

  if (isNoQuery) {
    const { data, error } = await supabase.from("schedules").select("*");
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
      .from("schedules")
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
      .from("schedules")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else {
      return NextResponse.json(data);
    }
  } else if (team_id) {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("team_id", team_id);
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
    title,
    description,
    start_time,
    end_time,
    actual_start_time,
    actual_end_time,
    change_log,
    tags,
    time_estimate,
    status,
    budget_id,
    isPartOfTeam,
  } = body;
  const allowedStatus = ["backlog", "pending", "done"];
  if (isPartOfTeam) {
    const { team_id } = body;
    if (!team_id) {
      return NextResponse.json(
        { error: "Missing team_id in request body" },
        { status: 400 }
      );
    }
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status in request body" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase.from("schedules").insert([
      {
        title: title,
        description: description,
        start_time: start_time,
        end_time: end_time,
        tags: tags,
        time_estimate: time_estimate,
        status: status,
        actual_start_time: actual_start_time,
        actual_end_time: actual_end_time,
        change_log: change_log,
        budget_id: budget_id,
        team_id: team_id,
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
    const { data, error } = await supabase.from("schedules").insert([
      {
        title: title,
        description: description,
        start_time: start_time,
        end_time: end_time,
        tags: tags,
        budget_id: budget_id,
        time_estimate: time_estimate,
        actual_start_time: actual_start_time,
        actual_end_time: actual_end_time,
        change_log: change_log,
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

export const PATCH = async (req: Request) => {
  const body = await req.json();
  const {
    id,
    name,
    description,
    timerange,
    start_time,
    end_time,
    actual_start_time,
    actual_end_time,
    change_log,
    tags,
    time_estimate,
    budget_id,
    status,
  } = body;
  const allowedStatus = ["backlog", "pending", "done"];
  if (!id) {
    return NextResponse.json(
      { error: "Missing id in request body" },
      { status: 400 }
    );
  }
  if (!allowedStatus.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status in request body" },
      { status: 400 }
    );
  }

  const isValidTimestamp = (timestamp: string) => !isNaN(Date.parse(timestamp));

  if (actual_start_time && !isValidTimestamp(actual_start_time)) {
    return NextResponse.json(
      { error: "Invalid actual_start_time format" },
      { status: 400 }
    );
  }

  if (actual_end_time && !isValidTimestamp(actual_end_time)) {
    return NextResponse.json(
      { error: "Invalid actual_end_time format" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("schedules")
    .update({
      name: name,
      description: description,
      timerange: timerange,
      start_time: start_time,
      end_time: end_time,
      budget_id: budget_id,
      actual_start_time: actual_start_time,
      actual_end_time: actual_end_time,
      change_log: change_log,
      tags: tags,
      time_estimate: time_estimate,
      status: status,
    })
    .eq("id", id);
  if (error) {
    console.error(error.message);
    return NextResponse.json(error.message);
  } else {
    return NextResponse.json(data);
  }
};

export const DELETE = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing id in request body" },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", id);
  if (error) {
    console.error(error.message);
    return NextResponse.json(error.message);
  } else {
    return NextResponse.json(data);
  }
};
