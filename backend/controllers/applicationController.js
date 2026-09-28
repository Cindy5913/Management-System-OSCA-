const supabase = require("../config/supabase");

const createSignedFileUrl = async (filePath) => {
  if (!filePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 60 * 30);

  if (error) {
    console.error(
      "Unable to create signed URL:",
      filePath,
      error
    );

    return null;
  }

  return data?.signedUrl || null;
};

const getApplications = async (req, res) => {
  try {
    // Get applications
    const {
      data: applications,
      error: applicationsError
    } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (applicationsError) {
      throw applicationsError;
    }

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        success: true,
        applications: []
      });
    }

    // Get application IDs
    const applicationIds = applications.map(
      application => application.application_id
    );

    // Get uploaded files
    const {
      data: files,
      error: filesError
    } = await supabase
      .from("application_files")
      .select(`
        application_id,
        valid_id_url,
        valid_id_back_url,
        latest_photo_url,
        birth_certificate_url,
        community_tax_certificate_url,
        signature_url,
        authentication_status,
        authentication_method,
        authenticated_by,
        authenticated_at,
        authentication_remarks,
        supporting_document_type
      `)
      .in("application_id", applicationIds);

    if (filesError) {
      throw filesError;
    }

    // Attach file information to each application
    const applicationsWithFiles = await Promise.all(
      applications.map(async (application) => {

        const fileRecord = files?.find(
          file =>
            file.application_id ===
            application.application_id
        );

        if (!fileRecord) {
          return {
            ...application,

            documents: {
              photo: null,
              bc: null,
              cedula: null
            },

            document_files: null
          };
        }

        // Create signed URLs for Supabase Storage files
        const [
          validIdFrontUrl,
          validIdBackUrl,
          photoUrl,
          birthCertificateUrl,
          cedulaUrl,
          signatureUrl
        ] = await Promise.all([
          createSignedFileUrl(
            fileRecord.valid_id_url
          ),

          createSignedFileUrl(
            fileRecord.valid_id_back_url
          ),

          createSignedFileUrl(
            fileRecord.latest_photo_url
          ),

          createSignedFileUrl(
            fileRecord.birth_certificate_url
          ),

          createSignedFileUrl(
            fileRecord.community_tax_certificate_url
          ),

          createSignedFileUrl(
            fileRecord.signature_url
          )
        ]);

        return {
          ...application,

          // Used by the Applications table
          documents: {
            idFront: validIdFrontUrl,
            idBack: validIdBackUrl,
            photo: photoUrl,
            bc: birthCertificateUrl,
            cedula: cedulaUrl,
            signature: signatureUrl
          },

          // Full document information
          document_files: {
            ...fileRecord,

            valid_id_url: validIdFrontUrl,
            valid_id_back_url: validIdBackUrl,
            latest_photo_url: photoUrl,
            birth_certificate_url: birthCertificateUrl,
            community_tax_certificate_url: cedulaUrl,
            signature_url: signatureUrl
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      applications: applicationsWithFiles
    });

  } catch (error) {
    console.error(
      "Error fetching applications:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve applications.",
      error: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required."
      });
    }

    const [
      applicationResult,
      familyResult,
      membershipResult,
      personalBackgroundResult,
      problemsNeedsResult,
      applicationFilesResult,
      confirmationsResult,
      documentAuthenticationsResult,
      statusHistoryResult
    ] = await Promise.all([

      supabase
        .from("applications")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("family_composition")
        .select("*")
        .eq("application_id", applicationId)
        .order("id", { ascending: true }),

      supabase
        .from("memberships")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("personal_background")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("problems_needs")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("application_files")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("confirmations")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle(),

      supabase
        .from("document_authentications")
        .select("*")
        .eq("application_id", applicationId)
        .order("id", { ascending: true }),

      supabase
        .from("application_status_history")
        .select("*")
        .eq("application_id", applicationId)
        .order("updated_at", { ascending: false })
    ]);

    const errors = [
      applicationResult.error,
      familyResult.error,
      membershipResult.error,
      personalBackgroundResult.error,
      problemsNeedsResult.error,
      applicationFilesResult.error,
      confirmationsResult.error,
      documentAuthenticationsResult.error,
      statusHistoryResult.error
    ].filter(Boolean);

    if (errors.length > 0) {
      throw errors[0];
    }

    if (!applicationResult.data) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    const applicationFiles =
      applicationFilesResult.data || null;

    let filesWithSignedUrls = null;

    if (applicationFiles) {

      const [
        validIdFrontSignedUrl,
        validIdBackSignedUrl,
        latestPhotoSignedUrl,
        birthCertificateSignedUrl,
        communityTaxSignedUrl,
        signatureSignedUrl
      ] = await Promise.all([

        createSignedFileUrl(
          applicationFiles.valid_id_url
        ),

        createSignedFileUrl(
          applicationFiles.valid_id_back_url
        ),

        createSignedFileUrl(
          applicationFiles.latest_photo_url
        ),

        createSignedFileUrl(
          applicationFiles.birth_certificate_url
        ),

        createSignedFileUrl(
          applicationFiles.community_tax_certificate_url
        ),

        createSignedFileUrl(
          applicationFiles.signature_url
        )
      ]);

      filesWithSignedUrls = {
        ...applicationFiles,

        valid_id_signed_url:
          validIdFrontSignedUrl,

        valid_id_back_signed_url:
          validIdBackSignedUrl,

        latest_photo_signed_url:
          latestPhotoSignedUrl,

        birth_certificate_signed_url:
          birthCertificateSignedUrl,

        community_tax_certificate_signed_url:
          communityTaxSignedUrl,

        signature_signed_url:
          signatureSignedUrl
      };
    }

    res.status(200).json({
      success: true,

      application: applicationResult.data,

      familyComposition:
        familyResult.data || [],

      membership:
        membershipResult.data || null,

      personalBackground:
        personalBackgroundResult.data || null,

      problemsNeeds:
        problemsNeedsResult.data || null,

      applicationFiles:
        filesWithSignedUrls,

      confirmations:
        confirmationsResult.data || null,

      documentAuthentications:
        documentAuthenticationsResult.data || [],

      statusHistory:
        statusHistoryResult.data || []
    });

  } catch (error) {

    console.error(
      "Error fetching application detail:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve application details.",
      error: error.message
    });
  }
};

module.exports = {
  getApplications,
  getApplicationById
};