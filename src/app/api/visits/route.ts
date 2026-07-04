import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

// POST — Public: record a page visit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, page, referrer, userAgent } = body;

    if (!visitorId || !page) {
      return NextResponse.json({ error: "visitorId and page required" }, { status: 400 });
    }

    // Parse device type from user agent
    const ua = (userAgent || "").toLowerCase();
    let deviceType = "desktop";
    if (/mobile|android|iphone|ipod/.test(ua)) deviceType = "mobile";
    else if (/tablet|ipad/.test(ua)) deviceType = "tablet";

    // Parse browser
    let browser = "Other";
    if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
    else if (ua.includes("edg")) browser = "Edge";
    else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

    const adminClient = createAdminClient();
    await adminClient.from("site_visits").insert({
      visitor_id: visitorId,
      page,
      referrer: referrer || "",
      user_agent: userAgent || "",
      device_type: deviceType,
      browser,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: true }); // Don't fail silently
  }
}

// GET — Admin only: fetch visitor analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

    // Today's stats
    const { data: todayVisits } = await adminClient
      .from("site_visits")
      .select("visitor_id, page, device_type, browser")
      .gte("created_at", todayStart);

    // This week
    const { data: weekVisits } = await adminClient
      .from("site_visits")
      .select("visitor_id, page, device_type")
      .gte("created_at", weekStart);

    // This month
    const { data: monthVisits } = await adminClient
      .from("site_visits")
      .select("visitor_id, page")
      .gte("created_at", monthStart);

    // This year
    const { data: yearVisits } = await adminClient
      .from("site_visits")
      .select("visitor_id")
      .gte("created_at", yearStart);

    // All time count
    const { count: allTimeCount } = await adminClient
      .from("site_visits")
      .select("*", { count: "exact", head: true });

    const { count: allTimeUnique } = await adminClient
      .from("site_visits")
      .select("visitor_id", { count: "exact", head: true });

    // Recent visitors (last 20)
    const { data: recentVisitors } = await adminClient
      .from("site_visits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Daily stats for chart (last 30 days)
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();
    const { data: chartVisits } = await adminClient
      .from("site_visits")
      .select("visitor_id, created_at")
      .gte("created_at", thirtyDaysAgo);

    // Build daily chart data
    const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = { views: 0, visitors: new Set() };
    }
    for (const v of chartVisits || []) {
      const key = new Date(v.created_at).toISOString().split("T")[0];
      if (dailyMap[key]) {
        dailyMap[key].views++;
        dailyMap[key].visitors.add(v.visitor_id);
      }
    }
    const dailyChart = Object.entries(dailyMap)
      .map(([date, d]) => ({ date, views: d.views, visitors: d.visitors.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Compute unique visitors helper
    const uniqueCount = (visits: { visitor_id: string }[] | null) =>
      new Set((visits || []).map(v => v.visitor_id)).size;

    // Top pages today
    const pageCount: Record<string, number> = {};
    for (const v of todayVisits || []) {
      pageCount[v.page] = (pageCount[v.page] || 0) + 1;
    }
    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Device breakdown today
    const deviceCount: Record<string, number> = {};
    for (const v of todayVisits || []) {
      deviceCount[v.device_type] = (deviceCount[v.device_type] || 0) + 1;
    }

    // Browser breakdown today
    const browserCount: Record<string, number> = {};
    for (const v of todayVisits || []) {
      browserCount[v.browser] = (browserCount[v.browser] || 0) + 1;
    }

    return NextResponse.json({
      today: {
        pageViews: (todayVisits || []).length,
        uniqueVisitors: uniqueCount(todayVisits),
      },
      week: {
        pageViews: (weekVisits || []).length,
        uniqueVisitors: uniqueCount(weekVisits),
      },
      month: {
        pageViews: (monthVisits || []).length,
        uniqueVisitors: uniqueCount(monthVisits),
      },
      year: {
        pageViews: (yearVisits || []).length,
        uniqueVisitors: uniqueCount(yearVisits),
      },
      allTime: {
        pageViews: allTimeCount || 0,
        uniqueVisitors: allTimeUnique || 0,
      },
      topPages,
      deviceBreakdown: deviceCount,
      browserBreakdown: browserCount,
      recentVisitors: recentVisitors || [],
      dailyChart,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
