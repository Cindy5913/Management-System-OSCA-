const supabase = require("../config/supabase");

const getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      applications: data
    });

  } catch (error) {
    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve applications."
    });
  }
};

module.exports = {
  getApplications
};